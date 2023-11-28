using Application.ViewModels.PostViewModels;
using Application.ViewModels.RequestViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{

    public interface IRequestService
    {
        Task<List<RequestModel>> GetRequests();
        Task<bool> CreateRequest(CreateRequestViewModel createRequestViewModel);
        Task<bool> UpdateRequest(UpdateRequestViewModel updateRequestViewModel);
        Task<bool> DeleteRequest(Guid  id);
    }
}
