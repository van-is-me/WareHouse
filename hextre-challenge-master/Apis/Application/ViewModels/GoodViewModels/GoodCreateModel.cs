using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.GoodViewModels
{
    public class GoodCreateModel
    {
        public Guid RentWarehouseId { get; set; }
        public string GoodName { get; set; }
        public int Quantity { get; set; }
        public GoodUnit GoodUnit { get; set; }
        public string Description { get; set; }
    }
}
