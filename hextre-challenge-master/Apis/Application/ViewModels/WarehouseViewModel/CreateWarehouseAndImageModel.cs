using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.WarehouseViewModel
{
    public class CreateWarehouseAndImageModel
    {
        public WarehourseCreateModel warehourse { get; set; }
        public IList<string> listImages { get; set; }
    }
}
