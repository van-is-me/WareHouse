using Application.Interfaces;
using Application.ViewModels.HashtagViewModels;
using AutoMapper;
using Domain.Entities;
using Org.BouncyCastle.Asn1.Mozilla;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Application.Services
{
    public class HashtagService : IHashtagService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentTime _currentTime;
        private readonly IMapper _mapper;

        public HashtagService(IUnitOfWork unitOfWork, ICurrentTime currentTime, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _currentTime = currentTime;
            _mapper = mapper;
        }

        public async Task<bool> CreateHashtag(CreateHashtagViewModel createHashtagView)
        {
            var mapper = _mapper.Map<Hashtag>(createHashtagView);

            await _unitOfWork.HashtagRepository.AddAsync(mapper);
            
            return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Create Hashtag faild.");

        }

        public async Task<bool> UpdateHashtag(UpdateHashtagViewModel updateHashtagView)
        {
            var mapper = _mapper.Map<Hashtag>(updateHashtagView);

            _unitOfWork.HashtagRepository.Update(mapper);

            return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Update Hashtag faild.");

        }

        public async Task<bool> DeleteHashtag(Guid id)
        {
            var hashtag = await _unitOfWork.HashtagRepository.GetByIdAsync(id);

            if (hashtag != null) {

                _unitOfWork.HashtagRepository.SoftRemove(hashtag);

                return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Delete Hashtag faild.");
            }

            throw new Exception("Don't found this Hashtag");
        }

        public async Task<List<HashtagViewModel>> GetHashtag()
        {
            var hashtag = await _unitOfWork.HashtagRepository.GetAllAsync();

            var mapper = _mapper.Map<List<HashtagViewModel>>(hashtag.Where(x => x.IsDeleted == false));

            return mapper;
        }

        public async Task<HashtagViewModel> GetById(Guid id)
        {
            var hashtag = await _unitOfWork.HashtagRepository.GetByIdAsync(id);

            var mapper = _mapper.Map<HashtagViewModel>(hashtag);

            return mapper;
        }
    }
}
