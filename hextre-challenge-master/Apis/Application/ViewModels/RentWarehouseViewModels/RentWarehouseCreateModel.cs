using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.RentWarehouseViewModels
{
    public class RentWarehouseCreateModel
    {
        public string CustomerId { get; set; }
        public string StaffId { get; set; }
        public string Information { get; set; }
        public RentStatus RentStatus { get; set; }
    }
}
