using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.ContractViewModels
{
    public class ContractModel
    {
        public Guid Id { get; set; }
        public string CustomerId { get; set; }
        public Guid RentWarehouseId { get; set; }
        public string StaffId { get; set; }
        public Guid OrderId { get; set; }
        public Guid ProviderId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string File { get; set; }
        public string Description { get; set; }
        public double ServicePrice { get; set; }
        public double WarehousePrice { get; set; }
        public double TotalPrice { get; set; }
        public double DepositFee { get; set; }
        public string ContractStatus { get; set; }

        public IList<ServicePayment> ServicePayments { get; set; }

        public virtual ApplicationUser Customer { get; set; }
        public virtual RentWarehouse RentWarehouse { get; set; }
    }
}
