using Application.ViewModels.ChemicalsViewModels;
using Application.ViewModels.RequestDetailViewModel;
using Application.ViewModels.RequestViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{

    public interface IRequestDetailService
    {
        Task<List<RequestDetailViewModel>> GetRequestDetails();
        Task<bool> CreateRequestDetails(CreateRequestDetailViewModel createRequestDetailsViewModel);
        Task<bool> UpdateRequestDetails(UpdateRequestDetailViewModel updateRequestDetailsViewModel);
        Task<bool> DeleteRequestDetail(Guid id);

        Task<List<RequestDetailViewModel>> GetRequestDetailsByRequestId(Guid id);
    }
}
