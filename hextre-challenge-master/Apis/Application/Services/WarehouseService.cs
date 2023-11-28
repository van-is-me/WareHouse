
using Application.Interfaces;
using Application.Repositories;
using Application.ViewModels.ImageWarehouseViewModels;
using Application.ViewModels.WarehouseViewModel;

namespace Application.Services
{
    public class WarehouseService:IWarehouseService
    {
        private readonly ITransactionRepository _transaction;

        public WarehouseService(ITransactionRepository transaction)
        {
            _transaction = transaction;
        }

        

        public async Task CreateWarehouseAsync(WarehourseCreateModel model, IList<ImageWarehouseCreateModel> listImage)
        {
            try
            {
                await _transaction.CreateWarehouseWithImage(model, listImage);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

    }
}
