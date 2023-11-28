using Application.ViewModels.WarehouseViewModel;
using FluentValidation;
using Infrastructures;

namespace WebAPI.Validations.Warehouses
{
    public class WarehouseUpdateValidator:AbstractValidator<WarehoureUpdateModel>
    {
        public WarehouseUpdateValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id không được để trống.")
               .Must(IsExist).WithMessage("Danh mục này không tồn tại");
            RuleFor(x => x.ProviderId).NotEmpty().WithMessage("Id đối tác không được để trống.")
                .Must(IsExistProvider).WithMessage("Đối tác này không tồn tại");
            RuleFor(x => x.CategoryId).NotEmpty().WithMessage("Id danh mục không được để trống.")
                .Must(IsExistCategory).WithMessage("Danh mục này không tồn tại");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Tên không được để trống.")
                .MaximumLength(200)
                .WithMessage("Tên không quá 200 ký tự.");
            RuleFor(x => x.Address).NotEmpty().WithMessage("Địa chỉ không được để trống.")
                .MaximumLength(100)
                .WithMessage("Địa chỉ không quá 100 ký tự.");
            RuleFor(x => x.LongitudeIP).NotEmpty().WithMessage("LongitudeIP không được để trống.");
            RuleFor(x => x.ShortDescription).NotEmpty().WithMessage("Mô tả ngắn không được để trống.")
                .MaximumLength(100)
                .WithMessage("Mô tả ngắn không quá 100 ký tự.");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Mô tả không được để trống.")
              .MaximumLength(1000)
              .WithMessage("Mô tả không quá 1000 ký tự.");
            RuleFor(x => x.LongitudeIP).NotEmpty().WithMessage("LongitudeIP không được để trống.");
            
        }

        private bool IsExist(Guid id)
        {
            var _context = new AppDbContext();
            var cate = _context.Warehouse.FirstOrDefault(x => x.Id == id && x.IsDeleted == false);
            if (cate == null)
            {
                return false;
            }
            return true;
        }

        private bool IsExistCategory(Guid id)
        {
            var _context = new AppDbContext();
            var cate = _context.Category.FirstOrDefault(x => x.Id == id && x.IsDeleted == false);
            if (cate == null)
            {
                return false;
            }
            return true;
        }
        private bool IsExistProvider(Guid id)
        {
            var _context = new AppDbContext();
            var cate = _context.Provider.FirstOrDefault(x => x.Id == id && x.IsDeleted == false);
            if (cate == null)
            {
                return false;
            }
            return true;
        }
    }
}
