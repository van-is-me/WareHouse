using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.ImageWarehouseViewModels
{
    public class ImageWarehouseCreateModel
    {
        public Guid WarehouseId { get; set; } =  Guid.NewGuid();
        public string ImageURL { get; set; }
    }
}
