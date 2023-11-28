using Application.ViewModels.ImageWarehouseViewModels;
using FluentValidation;
using Infrastructures;

namespace WebAPI.Validations.ImageWarehouses
{
    public class ImageWarehouseCreateValidator:AbstractValidator<ImageWarehouseCreateModel>
    {
        public ImageWarehouseCreateValidator()
        {
            RuleFor(x => x.WarehouseId).NotEmpty().WithMessage("Id kho không được để trống.")
                .Must(IsExistWarehouse).WithMessage("Kho này không tồn tại");
            RuleFor(x => x.ImageURL).NotEmpty().WithMessage("Tên không được để trống.");
        }
        private bool IsExistWarehouse(Guid id)
        {
            var _context = new AppDbContext();
            var cate = _context.Warehouse.FirstOrDefault(x => x.Id == id && x.IsDeleted ==false);
            if (cate == null)
            {
                return false;
            }
            return true;
        }
    }
}
