using Application.ViewModels.PostHashtagViewModels;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IPostHashtagService
    {
        Task<PostAndHashtagViewModel> GetPostAndHashtag();
        Task<List<PostHashtagViewModel>> GetPostHashtag();

        Task<bool> CreatePostHashtag(CreatePostHashtagViewModel createPostHashtag);
        Task<bool> UpdatePostHashtag(CreatePostHashtagViewModel updatePostHashtag);
        Task<bool> DeletePostHashtag(Guid id);
    }
}
