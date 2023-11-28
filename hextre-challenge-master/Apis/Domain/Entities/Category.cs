using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Category: BaseEntity
    {
        public string ImagerUrl { get; set; }
        public string Name { get; set; }
        public IList<Warehouse> Warehouses { get; set; }
    }
}
