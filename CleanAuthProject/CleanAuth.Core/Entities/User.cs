using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public string EmailToken { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "User";
        public List<RefreshToken> RefreshTokens { get; set; }
        public bool TwoFactorEnabled {  get; set; }
        public string? TwoFactorCode {  get; set; }
        public DateTime? TwoFactorExpiry {  get; set; }
        public string? ResetPasswordToken {  get; set; }
        public DateTime? ResetPasswordExpiry { get;set; }
        public string ? ProfileImageUrl { get; set; }
    }
}
