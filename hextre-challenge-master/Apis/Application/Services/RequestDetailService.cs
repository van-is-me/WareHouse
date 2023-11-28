using Application.Interfaces;
using Application.ViewModels.RequestDetailViewModel;
using Application.ViewModels.RequestViewModels;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class RequestDetailService : IRequestDetailService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentTime _currentTime;
        private readonly IMapper _mapper;

        public RequestDetailService(IUnitOfWork unitOfWork, ICurrentTime currentTime, IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _currentTime = currentTime;
        }
       

        public async Task<List<RequestDetailViewModel>> GetRequestDetails()
        {
            var requestDetails = await _unitOfWork.RequestDetailRepository.GetAllAsync();

            var mapper = _mapper.Map<List<RequestDetailViewModel>>(requestDetails.Where(x => x.IsDeleted == false));

            return mapper;
        }

        public async Task<bool> CreateRequestDetails(CreateRequestDetailViewModel createRequestDetailsViewModel)
        {
            var mapper = _mapper.Map<RequestDetail>(createRequestDetailsViewModel);

            await _unitOfWork.RequestDetailRepository.AddAsync(mapper);

            return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Tạo yêu cầu thất bại.");
        }

        public async Task<bool> UpdateRequestDetails(UpdateRequestDetailViewModel updateRequestDetailsViewModel)
        {
            var mapper = _mapper.Map<RequestDetail>(updateRequestDetailsViewModel);

            _unitOfWork.RequestDetailRepository.Update(mapper);

            return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Cập nhật yêu cầu thất bại.");
        }

        public async Task<bool> DeleteRequestDetail(Guid id)
        {
            var result = await _unitOfWork.RequestDetailRepository.GetByIdAsync(id);

            if (result == null)
                throw new Exception("Không tìm thấy  yêu cầu.");
            else
            {
                _unitOfWork.RequestDetailRepository.SoftRemove(result);

                return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Xoá yêu cầu thất bại.");
            }
        }

        public Task<List<RequestDetailViewModel>> GetRequestDetailsByRequestId(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}