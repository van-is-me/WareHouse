using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.WarehouseViewModel
{
    public class WarehoureUpdateModel
    {
        public Guid Id { get; set; }
        public Guid ProviderId { get; set; }
        public Guid CategoryId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public string LongitudeIP { get; set; }
        public string LatitudeIP { get; set; }
        public bool IsDisplay { get; set; }
    }
}
