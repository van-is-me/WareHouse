using Application.ViewModels.WarehouseDetailViewModels;
using FluentValidation;
using Infrastructures;

namespace WebAPI.Validations.WarehouseDetails
{
    public class WarehouseDetailUpdateValidator:AbstractValidator<WarehouseDetailUpdateModel>
    {
        public WarehouseDetailUpdateValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id không được để trống.")
                .Must(IsExistDetails).WithMessage("Chi tiết kho này không tồn tại.");
            RuleFor(x => x.WarehouseId).NotEmpty().WithMessage("WarehouseId không được để trống.")
                .Must(IsExistWarehouse).WithMessage("Kho chứa này không tồn tại.");

            RuleFor(x => x.WarehousePrice).NotEmpty().WithMessage("Giá Kho không được để trống.").GreaterThan(10000).WithMessage("Giá Kho phải lớn hơn 10.000VNĐ.");
            RuleFor(x => x.ServicePrice).NotEmpty().WithMessage("Giá dịch vụ quản lý kho không được để trống.").GreaterThan(10000).WithMessage("Giá dịch vụ quản lý kho phải lớn hơn 10.000VNĐ.");
            RuleFor(x => x.Width).NotEmpty().WithMessage("Chiều rộng không được để trống.").GreaterThan(0).WithMessage("Chiều rộng phải lớn hơn 0.");
            RuleFor(x => x.Height).NotEmpty().WithMessage("Chiều cao không được để trống.").GreaterThan(0).WithMessage("Chiều cao phải lớn hơn 0.");
            RuleFor(x => x.Depth).NotEmpty().WithMessage("Chiều sâu không được để trống.").GreaterThan(0).WithMessage("Chiều sau phải lớn hơn 0.");
            RuleFor(x => x.Quantity).NotEmpty().WithMessage("Số lượng kho không được để trống.").GreaterThan(0).WithMessage("Số lượng kho phải lớn hơn 0.");
            RuleFor(x => x.UnitType).NotEmpty().WithMessage("Loại kho không được để trống.");
        }

        private bool IsExistWarehouse(Guid id)
        {
            var _context = new AppDbContext();
            var cate = _context.Warehouse.FirstOrDefault(x => x.Id == id && x.IsDeleted == false);
            if (cate == null)
            {
                return false;
            }
            return true;
        }
        private bool IsExistDetails(Guid id)
        {
            var _context = new AppDbContext();
            var cate = _context.WarehouseDetail.FirstOrDefault(x => x.Id == id && x.IsDeleted == false);
            if (cate == null)
            {
                return false;
            }
            return true;
        }
    }
}
