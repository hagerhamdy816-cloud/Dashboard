using Core.Entities;
using Core.InterfacesCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.InterfacesCore
{
    public interface IUnitOfWork
    {
        IRepository<User> Users { get; }
        IRepository<RefreshToken> RefreshTokens { get; }
        Task SaveAsync();
    }
}
