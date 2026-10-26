using Application.DTOs;
using Application.Interfaces;
using BCrypt.Net;
using Core.InterfacesCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Application.AppService
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _uow;
        private readonly IEmailSender _emailSender;
        private readonly ITokenService _tokenService;

        public AuthService(
            IUnitOfWork uow,
            IEmailSender emailSender,
            ITokenService tokenService)
        {
            _uow = uow;
            _emailSender = emailSender;
            _tokenService = tokenService;
        }

        public async Task SendTwoFactorCodeAsync(string email)
        {
            var users = await _uow.Users.GetAllAsync();
            var user = users.FirstOrDefault(x => x.Email == email);
            if (user == null)
                throw new Exception("User not found");

            user.TwoFactorCode =
                RandomNumberGenerator.GetInt32(100000, 999999).ToString();

            user.TwoFactorExpiry = DateTime.UtcNow.AddMinutes(5);

            await _uow.SaveAsync();

            await _emailSender.SendAsync(
                user.Email,
                "Your 2FA Code",
                $"Your code is: {user.TwoFactorCode}"
            );
        }

        
        public Task RegisterAsync(RegisterDto dto)
            => throw new NotImplementedException();

        public Task<AuthResponse> LoginAsync(LoginDto dto)
            => throw new NotImplementedException();

        public async Task<bool> VerifyTwoFactorAsync(string email, string code)
        {
            var users = await _uow.Users.GetAllAsync();
            var user = users.FirstOrDefault(x => x.Email == email);
            if (user == null) return false;

            if (user.TwoFactorCode == code && user.TwoFactorExpiry != null && user.TwoFactorExpiry > DateTime.UtcNow)
            {
                user.TwoFactorCode = null;
                user.TwoFactorExpiry = null;
                await _uow.SaveAsync();
                return true;
            }
            return false;
        }

        public async Task SendResetPasswordTokenAsync(string email, string unused = null)
        {
            var users = await _uow.Users.GetAllAsync();
            var user = users.FirstOrDefault(x => x.Email == email);
            if (user == null)
                throw new Exception("User not found");

            user.ResetPasswordToken = Guid.NewGuid().ToString();
            user.ResetPasswordExpiry = DateTime.UtcNow.AddMinutes(15);

            await _uow.SaveAsync();

            await _emailSender.SendAsync(
                user.Email,
                "Password reset",
                $"Use this token to reset your password: {user.ResetPasswordToken}"
            );
        }

        public async Task ResetPasswordAsync(string token, string newPassword)
        {
            var users = await _uow.Users.GetAllAsync();
            var user = users.FirstOrDefault(x => x.ResetPasswordToken == token);

            if (user == null || user.ResetPasswordExpiry == null || user.ResetPasswordExpiry < DateTime.UtcNow)
                throw new Exception("Invalid or expired token");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.ResetPasswordToken = null;
            user.ResetPasswordExpiry = null;

            await _uow.SaveAsync();
        }
    }
}
