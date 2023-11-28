using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.OrderViewModels
{
    public class OrderCreateModel
    {
        public Guid WarehouseDetailId { get; set; }
        public string CustomerId { get; set; }
    }
}
