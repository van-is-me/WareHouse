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
    public class PostHashtagRepository : GenericRepository<PostHashtag>, IPostHashtagRepository
    {
        private readonly AppDbContext _context;
        public PostHashtagRepository(AppDbContext context, ICurrentTime timeService, IClaimsService claimsService) : base(context, timeService, claimsService)
        {
            _context = context;
        }

        public async Task<PostHashtag> FindPost(Guid postId)
        {
            return await _context.PostHashtag.Where(x => x.IsDeleted == false).FirstOrDefaultAsync(x => x.PostId == postId);
        }

        public async Task<PostHashtag> FindPostHashtag(Guid postId, Guid hashtagId)
        {
            return await _context.PostHashtag.Where(x => x.IsDeleted == false).FirstOrDefaultAsync(x => x.PostId == postId && x.HashtagId == hashtagId);
        }

        public override async Task<List<PostHashtag>> GetAllAsync()
        {
            return await _dbSet.Include(x => x.Hashtag).ToListAsync();
        }
    }
}
