using Application.ViewModels.HashtagViewModels;
using Application.ViewModels.PostCategoryViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IHashtagService
    {
        Task<List<HashtagViewModel>> GetHashtag();
        Task<bool> CreateHashtag(CreateHashtagViewModel createHashtagView);
        Task<bool> UpdateHashtag(UpdateHashtagViewModel updateHashtagView);
        Task<bool> DeleteHashtag(Guid id);

        Task<HashtagViewModel> GetById(Guid id);
    }
}
