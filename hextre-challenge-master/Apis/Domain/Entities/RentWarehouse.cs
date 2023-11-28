using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class RentWarehouse:BaseEntity
    {
        public string CustomerId { get; set; }
        public string StaffId { get; set; }
        public string Information { get; set; }
        public RentStatus RentStatus { get; set; }
        public IList<Contract> Contracts { get; set; }
        public IList<Good> Goods { get; set; }

    }
}
