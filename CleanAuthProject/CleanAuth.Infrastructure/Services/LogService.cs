using Application.Interfaces;
using Core.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class LogService : ILogService
    {
        private readonly AppDbContext _context;

        public LogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task LogAsync(string action, string email)
        {
            await _context.Logs.AddAsync(new LogEntry
            {
                Action = action,
                UserEmail = email
            });
            await _context.SaveChangesAsync();
        }
    }
}
