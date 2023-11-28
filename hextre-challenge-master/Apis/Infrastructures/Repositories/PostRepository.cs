using Application.Interfaces;
using Application.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructures.Repositories
{
    public class PostRepository : GenericRepository<Post>, IPostRepository
    {
        private readonly AppDbContext _dbContext;
        public PostRepository(AppDbContext context, ICurrentTime timeService, IClaimsService claimsService) : base(context, timeService, claimsService)
        {
            _dbContext = context;
        }

        public override async Task<List<Post>> GetAllAsync()
        { 
            return await _dbSet.Include(x => x.Author).Include(x => x.PostCategory).Include(x => x.PostCategorys).ToListAsync();
        }

        public override async Task<Post?> GetByIdAsync(Guid id)
        {
            var result = await _dbSet.Include(x => x.Author).Include(x => x.PostCategory).Include(x => x.PostCategorys).FirstOrDefaultAsync(x => x.Id == id);
            // todo should throw exception when not found
            return result;
        }
    }
}
