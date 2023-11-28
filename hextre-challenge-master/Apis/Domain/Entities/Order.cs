using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Order: BaseEntity
    {
        [ForeignKey("WarehouseDetail")]
        public Guid WarehouseDetailId { get; set; }
        [ForeignKey("ApplicationUser")]
        public string CustomerId { get; set; }
        public bool ContactInDay { get; set; }
        public int TotalCall { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public string? CancelReason { get; set; }
        public double WarehousePrice { get; set; }
        public double ServicePrice { get; set; }
        public double TotalPrice { get; set; }
        public double Deposit { get; set; }

        public double Width { get; set; }
        public double Height { get; set; }
        public double Depth { get; set; }
        public UnitType UnitType { get; set; }
        public PaymentStatus PaymentStatus { get; set; }

        public virtual WarehouseDetail WarehouseDetail { get; set; }
        public virtual ApplicationUser Customer { get; set; }
        public IList<DepositPayment> DepositPayments { get; set; }
    }
}
