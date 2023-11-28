using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ServicePayment:BaseEntity
    {
        [ForeignKey("Contract")]
        public Guid ContractId { get; set; }
        public int MonthPayment { get; set; }
        public int YearPayment { get; set; }
        public double ServicePrice { get; set; }
        public double WarehousePrice { get; set; }
        public double TotalPrice { get; set; }
        public DateTime Deadline { get; set; } = DateTime.Now.AddDays(10);
        public DateTime? PaymentDate { get; set; }
        //public DateTime ExtensionPeriod { get; set; }
        public PaymentType PaymentType { get; set; } = PaymentType.Monthly;
        public bool? ContactedInDay { get; set; } = false;
        public bool IsPaid { get; set; } = false;
        public virtual Contract Contract { get; set; }
    }
}
