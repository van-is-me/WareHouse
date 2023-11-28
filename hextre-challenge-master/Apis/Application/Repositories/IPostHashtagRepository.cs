using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface IPostHashtagRepository : IGenericRepository<PostHashtag>
    {
        Task<PostHashtag> FindPostHashtag(Guid postId, Guid hashtagId);
        Task<PostHashtag> FindPost(Guid postId);
    }
}
