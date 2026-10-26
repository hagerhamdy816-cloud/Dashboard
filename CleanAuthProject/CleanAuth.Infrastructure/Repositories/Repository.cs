using Core.InterfacesCore;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly AppDbContext _context;
        private readonly DbSet<T> _db;

        public Repository(AppDbContext context)
        {
            _context = context;
            _db = _context.Set<T>();
        }

        public async Task<List<T>> GetAllAsync()
            => await _db.ToListAsync();

        public async Task<T?> GetByIdAsync(int id)
            => await _db.FindAsync(id);

        public async Task AddAsync(T entity)
            => await _db.AddAsync(entity);

        public void Delete(T entity)
            => _db.Remove(entity);
    }
}
