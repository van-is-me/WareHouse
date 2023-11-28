using Application.Interfaces;
using Application.ViewModels.PostHashtagViewModels;
using Application.ViewModels.PostViewModels;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class PostService : IPostService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentTime _currentTime;
        private readonly IMapper _mapper;
        private readonly IClaimsService _claimsService; 

        public PostService(IUnitOfWork unitOfWork, ICurrentTime currentTime, IMapper mapper, IClaimsService claimsService)
        {
            _unitOfWork = unitOfWork;
            _currentTime = currentTime;
            _mapper = mapper;
            _claimsService = claimsService;
        }

        public async Task<List<PostViewModel>> GetPost()
        {
            var post = _unitOfWork.PostRepository.GetAllAsync().Result.Where(x => x.IsDeleted == false).ToList();
     
            List<PostViewModel> listPostViewModel = new List<PostViewModel>();

            foreach (var item in post)
            {

                var nameHasTag = _unitOfWork.PostHashtagRepository.GetAllAsync().Result.Where(x => x.PostId == item.Id).Select(x => x.Hashtag.HashtagName).ToList();

                var mapper = _mapper.Map<PostViewModel>(item);

                mapper.HashtagName = nameHasTag;

                listPostViewModel.Add(mapper);
            }

            return listPostViewModel;
        }

        public async Task<bool> CreatePost(CreatePostViewModel createPostViewModel)
        {

            var postCategory = await _unitOfWork.PostCategoryRepository.GetByIdAsync(createPostViewModel.PostCategoryId);
         
            if (postCategory != null)
            {
                var mapper = _mapper.Map<Post>(createPostViewModel);

                mapper.AuthorId = _claimsService.GetCurrentUserId.ToString();

                await _unitOfWork.PostRepository.AddAsync(mapper);

                return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Tạo bài đăng thất bại.");
            }
            throw new Exception("Không tìm thấy danh mục bài viết.");
        }

        public async Task<bool> UpdatePost(UpdatePostViewModel updatePostViewModel)
        {

            var postCategory = await _unitOfWork.PostCategoryRepository.GetByIdAsync(updatePostViewModel.PostCategoryId);

            if (postCategory != null)
            {

                var mapper = _mapper.Map<Post>(updatePostViewModel);

                mapper.AuthorId = _claimsService.GetCurrentUserId.ToString();

                _unitOfWork.PostRepository.Update(mapper);

                return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Câp nhật bài đăng thất bại.");
            }
            throw new Exception("Không tìm thấy danh mục bài viết.");
        }

        public async Task<bool> DeletePost(Guid id)
        {
            var result = await _unitOfWork.PostRepository.GetByIdAsync(id);

            if (result == null)
                throw new Exception("Không tìm thấy bài đăng này.");
            else
            {
                _unitOfWork.PostRepository.SoftRemove(result);
                return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Xoá bài đăng thất bại.");
            }
        }
    }
}
