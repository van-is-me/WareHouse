using Application.ViewModels.PostViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IPostService
    {
        Task<List<PostViewModel>> GetPost();
        Task<bool> CreatePost(CreatePostViewModel createPostViewModel);
        Task<bool> UpdatePost(UpdatePostViewModel updatePostViewModel);
        Task<bool> DeletePost(Guid id);
    }
}
