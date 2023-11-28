using Application.Interfaces;
using Application.ViewModels.HashtagViewModels;
using Application.ViewModels.PostHashtagViewModels;
using Application.ViewModels.PostViewModels;
using AutoMapper;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class PostHashtagService : IPostHashtagService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentTime _currentTime;
        private readonly IMapper _mapper;

        public PostHashtagService(IUnitOfWork unitOfWork, ICurrentTime currentTime, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _currentTime = currentTime;
            _mapper = mapper;
        }

        public async Task<bool> CreatePostHashtag(CreatePostHashtagViewModel createPostHashtag)
        {

            //dòng này dùng để check tránh nhập trùng hashtag
            foreach (var item in createPostHashtag.HashtagId)
            {
                if (await _unitOfWork.PostHashtagRepository.FindPostHashtag(createPostHashtag.PostId, item) is not null)
                    throw new Exception("Không được trùng Hashtag.");
            }

            var checkPost = await _unitOfWork.PostRepository.GetByIdAsync(createPostHashtag.PostId);

            if (checkPost is null)
                throw new Exception("Không tìm thấy bải đăng");

            foreach (var item in createPostHashtag.HashtagId)
            {
                if (await _unitOfWork.HashtagRepository.GetByIdAsync(item) is null)
                {
                    throw new Exception("Không tìm thấy Hashtag");
                }
                await _unitOfWork.PostHashtagRepository.AddAsync(new PostHashtag { PostId = createPostHashtag.PostId, HashtagId = item });

                if (await _unitOfWork.SaveChangeAsync() == 0) throw new Exception("Tạo Hashtag thất bại.");
            }
            return true;
        }

        public async Task<bool> DeletePostHashtag(Guid id)
        {
            var result = await _unitOfWork.PostHashtagRepository.GetByIdAsync(id);

            if (result == null)
                throw new Exception("Không tìm thấy bài đăng này.");
            else
            {
                _unitOfWork.PostHashtagRepository.SoftRemove(result);
                return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Xoá HashTag thất bại");
            }
        }

        //hàm này là show ra để create
        public async Task<PostAndHashtagViewModel> GetPostAndHashtag()
        {
            var post = await _unitOfWork.PostRepository.GetAllAsync();

            var mapperPost = _mapper.Map<List<PostViewModel>>(post);

            var hashtag = await _unitOfWork.HashtagRepository.GetAllAsync();

            var mapperHastag = _mapper.Map<List<HashtagViewModel>>(hashtag);

            PostAndHashtagViewModel postHashtagView = new PostAndHashtagViewModel();

            postHashtagView.Posts = mapperPost;
            postHashtagView.Hashtags = mapperHastag;

            return postHashtagView;
        }

        //hàm này show ra để update
        public async Task<List<PostHashtagViewModel>> GetPostHashtag()
        {
            var listPost = await _unitOfWork.PostRepository.GetAllAsync();

            var listHashtag = await _unitOfWork.HashtagRepository.GetAllAsync();

            var listPostHashtag = await _unitOfWork.PostHashtagRepository.GetAllAsync();

            List<PostHashtagViewModel> ListPostHashtag = new List<PostHashtagViewModel>();

            foreach (var item in listPostHashtag)
            {
                PostHashtagViewModel postHashtag = new PostHashtagViewModel();

                var post = listPost.FirstOrDefault(x => x.Id == item.PostId);

                var hashtag = listHashtag.FirstOrDefault(x => x.Id == item.HashtagId);

                postHashtag.Id = item.Id;
                postHashtag.PostId = post.Id;
                postHashtag.NamePost = post.Name;
                postHashtag.HashtagId = hashtag.Id;
                postHashtag.HashtagName = hashtag.HashtagName;

                ListPostHashtag.Add(postHashtag);
            }
            return ListPostHashtag;
        }

        public async Task<bool> UpdatePostHashtag(CreatePostHashtagViewModel hashtagViewModel)
        {
            //dòng này dùng để check tránh nhập trùng hashtag
            foreach (var item in hashtagViewModel.HashtagId)
            {
                if (await _unitOfWork.PostHashtagRepository.FindPostHashtag(hashtagViewModel.PostId, item) is not null)
                    throw new Exception("Không được trùng Hashtag.");

                if (await _unitOfWork.HashtagRepository.GetByIdAsync(item) is null)
                {
                    throw new Exception("Không tìm thấy Hashtag.");
                }
            }

            var checkPost = await _unitOfWork.PostRepository.GetByIdAsync(hashtagViewModel.PostId);

            if (checkPost is null)
                throw new Exception("Không tìm thấy bài đăng.");

            /*foreach (var item in hashtagViewModel.HashtagId)
            {

                var hashPost = await _unitOfWork.PostHashtagRepository.FindPost(hashtagViewModel.PostId);
                if (await _unitOfWork.PostHashtagRepository.FindPostHashtag(hashtagViewModel.PostId, item)

                    hashPost.HashtagId = item;

                _unitOfWork.PostHashtagRepository.Update(hashPost);

                if (await _unitOfWork.SaveChangeAsync() == 0) throw new Exception("Update faild.");
            }*/
            int i = 0;
            foreach (var item in await _unitOfWork.PostHashtagRepository.GetAllAsync())
            {
                var hashPost = await _unitOfWork.PostHashtagRepository.FindPost(item.PostId);            

                hashPost.HashtagId = hashtagViewModel.HashtagId.ElementAt(i);

                if (i != 0) i++;
                
                _unitOfWork.PostHashtagRepository.Update(hashPost);

                if (await _unitOfWork.SaveChangeAsync() == 0) throw new Exception("Cập nhật thất bại.");
            }
            return true;
        }
    }
}
