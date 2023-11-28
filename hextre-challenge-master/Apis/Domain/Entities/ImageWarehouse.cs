using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ImageWarehouse : BaseEntity
    {
        [ForeignKey("Warehouse")]
        public Guid WarehouseId { get; set; }
        public string ImageURL { get; set; }
        public virtual Warehouse Warehouse { get; set; }
    }
}
