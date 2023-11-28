using Application.ViewModels.ImageWarehouseViewModels;
using Application.ViewModels.WarehouseViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IWarehouseService
    {
        public Task CreateWarehouseAsync(WarehourseCreateModel model, IList<ImageWarehouseCreateModel> listImage);
    }
}
