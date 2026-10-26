using Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDto dto);
        Task<AuthResponse> LoginAsync(LoginDto dto);
        Task SendTwoFactorCodeAsync(string email);
        Task<bool> VerifyTwoFactorAsync(string email, string code);
        Task SendResetPasswordTokenAsync(string email, string code);
        Task ResetPasswordAsync(string token, string newPassword);

    }
}
