using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.OrderViewModels
{
    public class UpdateOrderStatusModel
    {
        public Guid Id { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public DateTime? PickupDay { get; set; }
    }
}
