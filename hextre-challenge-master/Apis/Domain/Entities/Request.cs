using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Request:BaseEntity
    {
        [ForeignKey("ApplicationUser")]
        public string CustomerId { get; set; }
        public string StaffId { get; set; }
        public RequestStatus RequestStatus { get; set; }
        public string? DenyReason { get; set; }
        public RequestType RequestType { get; set; }
        public DateTime? CompleteDate { get; set; }

        public virtual ApplicationUser Customer { get; set; }
        public IList<RequestDetail> Details { get; set; }
    }
}
