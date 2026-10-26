using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize(Roles ="Admin")]
    [Route("api/admin")]
    public class AdminDashboard : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminDashboard(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult>GetUsers()
        {
            return Ok(await _context.Users.ToListAsync());
        }

        [HttpGet("logs")]
        public async Task<IActionResult> GetLogs()
        {
            return Ok(await _context.Logs.OrderByDescending(x => x.CreatedAt).ToListAsync());
        }
    }
}
