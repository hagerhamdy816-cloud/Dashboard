using Application.DTOs;
using Application.Interfaces;
using BCrypt.Net;
using Core.Entities;
using Core.InterfacesCore;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly ITokenService _tokenService;

        public AuthController(IUnitOfWork uow, ITokenService tokenService)
        {
            _uow = uow;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var existingUser = (await _uow.Users.GetAllAsync())
                .FirstOrDefault(x => x.Email == dto.Email);

            if (existingUser != null)
                return BadRequest(new { message = "Email already exists" });

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "User",
                EmailToken = Guid.NewGuid().ToString(),
                EmailConfirmed = false
            };

            await _uow.Users.AddAsync(user);
            await _uow.SaveAsync();

            return Ok(new { message = "Registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = (await _uow.Users.GetAllAsync())
                .FirstOrDefault(x => x.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid credentials" });

            if (!user.EmailConfirmed)
                return Unauthorized(new { message = "Please confirm your email before logging in" });

            var accessToken = _tokenService.CreateAccessToken(user);
            var refreshToken = await _tokenService.CreateRefreshToken(user);

            return Ok(new { accessToken, refreshToken });
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required" });

            var users = await _uow.Users.GetAllAsync();
            var user = users.FirstOrDefault(x => x.EmailToken == token);

            if (user == null)
                return BadRequest(new { message = "Invalid or expired token" });

            if (user.EmailConfirmed)
                return Ok(new { message = "Email already confirmed" });

            user.EmailConfirmed = true;
            user.EmailToken = null;

            await _uow.SaveAsync();

            return Ok(new { message = "Email confirmed successfully. You can now login." });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody]string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "Refresh token is required" });

            var token = await _uow.RefreshTokens.GetAllAsync();
            var stored = token.FirstOrDefault(x => x.Token == refreshToken && !x.IsRevoked);

            if (stored == null || stored.ExpiryDate < DateTime.Now)
                return Unauthorized(new { message = "Invalid or expired refresh token" });

            var user = await _uow.Users.GetByIdAsync(stored.UserId);
            var newAccessToken = _tokenService.CreateAccessToken(user);

            return Ok(new { accessToken = newAccessToken });
        }

        [HttpPost("verify-2fa")]
        public async Task<IActionResult> Verify2FA([FromForm] string email, [FromForm] string code)
        {
            var users = await _uow.Users.GetAllAsync();
            var user = users.FirstOrDefault(x => x.Email == email);

            if (user == null || user.TwoFactorCode != code || user.TwoFactorExpiry == null || user.TwoFactorExpiry < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired code" });

            // clear 2FA values
            user.TwoFactorCode = null;
            user.TwoFactorExpiry = null;
            await _uow.SaveAsync();

            var accessToken = _tokenService.CreateAccessToken(user);
            var refreshToken = await _tokenService.CreateRefreshToken(user);

            return Ok(new { accessToken, refreshToken });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromForm] string token, [FromForm] string newPassword)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(newPassword))
                return BadRequest(new { message = "Token and new password are required"});

            var users = await _uow.Users.GetAllAsync();
            var user = users.FirstOrDefault(x => x.ResetPasswordToken == token);

            if (user == null || user.ResetPasswordExpiry == null || user.ResetPasswordExpiry < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired token" });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.ResetPasswordToken = null;
            user.ResetPasswordExpiry = null;

            await _uow.SaveAsync();

            return Ok(new { message = "Password updated successfully" });
        }
    }

    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        [HttpGet]
        public IActionResult AdminOnly()
        {
            return Ok(new { message = "Admin Access Granted" });
        }
    }
}





//using Application.DTOs;
//using Application.Interfaces;
//using Core.Entities;
//using Infrastructure.Data;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using BCrypt.Net;

//namespace API.Controllers
//{
//    [Route("api/auth")]
//    [ApiController]
//    public class AuthController : ControllerBase
//    {
//        private readonly AppDbContext _context;
//        private readonly IJwtService _jwt;

//        public AuthController(AppDbContext context, IJwtService jwt)
//        {
//            _context = context;
//            _jwt = jwt;
//        }

//        [HttpPost("register")]

//        public async Task<IActionResult> Register(RegisterDto dto)
//        {
//            if (await _context.Users.AnyAsync(x => x.Email == dto.Email))
//                return BadRequest("Email already exists");
//            var user = new User
//            {
//                FullName = dto.FullName,
//                Email = dto.Email,
//                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
//            };
//            _context.Users.Add(user);
//            await _context.SaveChangesAsync();
//            return Ok("User Registered");
//        }

//        [HttpPost("login")]
//        public async Task<IActionResult> Login(LoginDto dto)
//        {
//            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);
//            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
//                return Unauthorized("Invalid credetials");
//            var token = _jwt.GenerateToken(user);
//            return Ok(new { token });
//        }
//    }
//}
