using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class WarehouseDetail:BaseEntity
    {
        [ForeignKey("Warehouse")]
        public Guid WarehouseId { get; set; }
        public double WarehousePrice { get; set; }
        public double ServicePrice { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public double Depth { get; set; }
        public UnitType UnitType { get; set; }
        public int Quantity { get; set; }

        public bool IsDisplay { get; set; }

        public virtual Warehouse Warehouse { get; set; }
        public IList<Order> Orders { get; set; }
    }
}
