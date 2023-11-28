using Application.ViewModels.ProviderViewModels;
using FluentValidation;
using Infrastructures;

namespace WebAPI.Validations.Providers
{
    public class ProviderCreateValidator: AbstractValidator<CreateProviderViewModel>
    {
        public ProviderCreateValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Tên không được để trống.")
                .Must(IsIdentityName).WithMessage("Tên đã được sử dụng.").MaximumLength(50)
                .WithMessage("Tên không quá 50 ký tự.");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email không được để trống.")
                .MaximumLength(50)
                .WithMessage("Email không quá 50 ký tự.")
                .Must(IsIdentityEmail).WithMessage("Email đã được sử dụng.").EmailAddress().WithMessage("Email không hợp lệ.");
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Số điện thoại không được để trống.")
                .MaximumLength(10)
                .WithMessage("Số điện thoại phải có 10 ký tự.").MinimumLength(10)
                .WithMessage("Số điện thoại  phải có 10 ký tự.");
            RuleFor(x => x.ShortDescription).NotEmpty().WithMessage("Mô tả ngắn không được để trống.")
                .MaximumLength(300)
                .WithMessage("Mô tả ngắn không quá 300 ký tự.");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Mô tả không được để trống.")
              .MaximumLength(1000)
              .WithMessage("Mô tả không quá 1000 ký tự.");
            RuleFor(x => x.Address).NotEmpty().WithMessage("Địa chỉ không được để trống.")
              .MaximumLength(100)
              .WithMessage("Địa chỉ không quá 100 ký tự.");
            RuleFor(x => x.Image).NotEmpty().WithMessage("Hình ảnh không được để trống.")
              ;
        }

        private bool IsIdentityName(string name)
        {
            var _context = new AppDbContext();
            var prod = _context.Provider.FirstOrDefault(x => x.Name.ToLower().Equals(name.ToLower()));
            if (prod == null)
            {
                return true;
            }
            return false;
        }

        private bool IsIdentityEmail(string email)
        {
            var _context = new AppDbContext();
            var prod = _context.Provider.FirstOrDefault(x => x.Email.ToLower().Equals(email.ToLower()));
            if (prod == null)
            {
                return true;
            }
            return false;
        }
        private bool IsIdentityPhone(string phone)
        {
            var _context = new AppDbContext();
            var prod = _context.Provider.FirstOrDefault(x => x.Phone.ToLower().Equals(phone.ToLower()));
            if (prod == null)
            {
                return true;
            }
            return false;
        }
       /* private bool IsIdentity(int categoryId)
        {
            var _context = new FstoreDbContext();
            var cate = _context.Categories.SingleOrDefault(x => x.CategoryId == categoryId);
            if (cate != null)
            {
                return true;
            }
            return false;
        }*/
    }
}
