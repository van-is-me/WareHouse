using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.OrderViewModels
{
    public class OrderViewModel
    {
        public Guid Id { get; set; }
        public Guid WarehouseDetailId { get; set; }
        public string CustomerId { get; set; }
        public bool ContactInDay { get; set; }
        public int TotalCall { get; set; }
        public string OrderStatus { get; set; }
        public string? CancelReason { get; set; }
        public double WarehousePrice { get; set; }
        public double ServicePrice { get; set; }
        public double TotalPrice { get; set; }
        public double Deposit { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public double Depth { get; set; }
        public string UnitType { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime? DeletionDate { get; set; }
        public DateTime CreationDate { get; set; }

        public Guid? DeleteBy { get; set; }

        public virtual WarehouseDetail WarehouseDetail { get; set; }
        public virtual ApplicationUser Customer { get; set; }
        public IList<DepositPayment> DepositPayments { get; set; }
    }
}
