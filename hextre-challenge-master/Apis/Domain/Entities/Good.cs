using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Good:BaseEntity
    {
        [ForeignKey("RentWarehouse")]
        public Guid RentWarehouseId { get; set; }
        [ForeignKey("GoodCategory")]
        public Guid GoodCategoryId { get; set; }
        public string GoodName { get; set; }
        public int Quantity { get; set; }
        public GoodUnit GoodUnit { get; set; }
        public string Description { get; set; }
        public DateTime ExpirationDate { get; set; }


        public virtual RentWarehouse RentWarehouse { get; set; }
        public virtual GoodCategory GoodCategory { get; set; }
        public IList<GoodImage> GoodImages { get; set; }
    }
}
