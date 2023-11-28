using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.WarehouseDetailViewModels
{
    public class WarehouseDetailCreateModel
    {
        public Guid WarehouseId { get; set; }
        public double WarehousePrice { get; set; }
        public double ServicePrice { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public double Depth { get; set; }
        public UnitType UnitType { get; set; }
        public int Quantity { get; set; }
    }
}
