using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Warehouse:BaseEntity
    {
        [ForeignKey("Provider")]
        public Guid ProviderId { get; set; }
        [ForeignKey("Category")]
        public Guid CategoryId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public string LongitudeIP { get; set; }
        public string LatitudeIP { get; set; }
        public bool IsDisplay { get; set; }

        public virtual Provider Provider { get; set; }
        public virtual Category Category { get; set; }

        public IList<ImageWarehouse> ImageWarehouses { get; set; }
        public IList<WarehouseDetail> WarehouseDetails { get; set; }
        public IList<Feedback> Feedbacks { get; set; }

    }
}
