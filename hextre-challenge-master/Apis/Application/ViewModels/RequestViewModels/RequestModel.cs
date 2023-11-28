using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.RequestViewModels
{
    public class RequestModel
    {
        public Guid Id { get; set; }
        public string CustomerId { get; set; }
        public string StaffId { get; set; }
        public string RequestStatus { get; set; }
        public string? DenyReason { get; set; }
        public string RequestType { get; set; }
        public DateTime? CompleteDate { get; set; }
        public string StaffName { get; set; }
        public string CustomerName { get; set;}

    }
}
