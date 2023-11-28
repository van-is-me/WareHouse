using Application.ViewModels.OrderViewModels;
using FluentValidation;
using Infrastructures;

namespace WebAPI.Validations.Orders
{
    public class OrderCreateValidator:AbstractValidator<OrderCreateModel>
    {
        public OrderCreateValidator()
        {
            RuleFor(x => x.CustomerId).NotEmpty().WithMessage("Id khách hàng không được để trống.");
            RuleFor(x => x.WarehouseDetailId).NotEmpty().WithMessage("Id chi tiết kho không được để trống.")
                .Must(IsExistDetail).WithMessage("Chi tiết kho này không tồn tại");
            
        }

        private bool IsExistDetail(Guid id)
        {
            var _context = new AppDbContext();
            var cate = _context.Warehouse.FirstOrDefault(x => x.Id == id && x.IsDeleted == false);
            if (cate == null)
            {
                return false;
            }
            return true;
        }
    }
}
