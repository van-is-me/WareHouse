using Application.ViewModels.ImageWarehouseViewModels;
using Application.ViewModels.WarehouseViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Application.Repositories
{
    public interface ITransactionRepository
    {
        public Task CreateWarehouseWithImage(WarehourseCreateModel warehouse, IList<ImageWarehouseCreateModel> listImages);
    }
}
