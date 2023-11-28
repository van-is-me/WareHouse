using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.RequestViewModels
{
    public class UpdateRequestViewModel
    {
        public Guid Id { get; set; }
        public string CustomerId { get; set; }
        public string StaffId { get; set; }
        public RequestStatus RequestStatus { get; set; }
        public string? DenyReason { get; set; }
        public RequestType RequestType { get; set; }
        public DateTime? CompleteDate { get; set; }
    }
}
