using Application.Interfaces;
using Application.ViewModels.PostCategoryViewModels;
using Application.ViewModels.PostViewModels;
using Application.ViewModels.RequestDetailViewModel;
using Application.ViewModels.RequestViewModels;
using AutoMapper;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class RequestService : IRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentTime _currentTime;
        private readonly IMapper _mapper;

        public RequestService(IUnitOfWork unitOfWork, ICurrentTime currentTime, IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _currentTime = currentTime;
        }
        public async Task<List<RequestModel>> GetRequests()
        {
            var requests = await _unitOfWork.RequestRepository.GetAllAsync();

            var mapper = _mapper.Map<List<RequestModel>>(requests.Where(x => x.IsDeleted == false));

            return mapper;
        }

        public async Task<bool> CreateRequest(CreateRequestViewModel createRequestViewModel)
        {
            try
            {
                createRequestViewModel.RequestId = Guid.NewGuid();
                createRequestViewModel.StaffId = createRequestViewModel.StaffId;
                createRequestViewModel.CustomerId = createRequestViewModel.CustomerId;
                createRequestViewModel.CompleteDate = DateTime.Now;
                createRequestViewModel.DenyReason = createRequestViewModel.DenyReason;
                createRequestViewModel.RequestStatus = createRequestViewModel.RequestStatus;
                createRequestViewModel.RequestType = createRequestViewModel.RequestType;
                if (createRequestViewModel.RequestDetails == null)
                {
                    createRequestViewModel.RequestDetails = new List<CreateRequestDetailViewModel>();
                }

                foreach (var requestDetail in createRequestViewModel.RequestDetails)
                {
                    requestDetail.RequestId = createRequestViewModel.RequestId;
                    requestDetail.GoodId = requestDetail.GoodId;
                    requestDetail.Quantity = requestDetail.Quantity;
                }

                var newOrder = _mapper.Map<Request>(createRequestViewModel);

                await _unitOfWork.RequestRepository.AddAsync(newOrder);

                return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Tạo yêu cầu thất bại.");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task<bool> UpdateRequest(UpdateRequestViewModel updateRequestViewModel)
        {
            updateRequestViewModel.CompleteDate = DateTime.Now;
            var mapper = _mapper.Map<Request>(updateRequestViewModel);

            _unitOfWork.RequestRepository.Update(mapper);

            return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Cập nhật yêu cầu thất bại.");
        }

        public async Task<bool> DeleteRequest(Guid id)
        {
            var result = await _unitOfWork.RequestRepository.GetByIdAsync(id);

            if (result == null)
                throw new Exception("Không tìm thấy  yêu cầu.");
            else
            {
                _unitOfWork.RequestRepository.SoftRemove(result);

                return await _unitOfWork.SaveChangeAsync() > 0 ? true : throw new Exception("Xoá yêu cầu thất bại.");
            }
        }



    }
}
