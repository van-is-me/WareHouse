using Application.ViewModels.PostCategoryViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IPostCategoryService
    {
        Task<List<PostCategoryViewModel>> GetPostCategory();
        Task<bool> CreatePostCategory(CreatePostCategoryViewModel createPostCategoryViewModel);
        Task<bool> UpdatePostCategory(UpdatePostCategoryViewModel updatePostCategoryViewModel);
        Task<bool> DeletePostCategory(Guid id);
    }
}
