using Application.ViewModels.ProviderViewModels;
using FluentValidation;

namespace WebAPI.Validations.Providers
{
    public class ProviderUpdateValidator:AbstractValidator<UpdateProviderViewModel>
    {
        public ProviderUpdateValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Tên không được để trống.")
              .MaximumLength(50)
               .WithMessage("Tên không quá 50 ký tự.");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email không được để trống.")
                .MaximumLength(50)
                .WithMessage("Email không quá 50 ký tự.")
                .EmailAddress().WithMessage("Email không hợp lệ.");
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Số điện thoại không được để trống.")
                .MaximumLength(10)
                .WithMessage("Số điện thoại không quá 50 ký tự.");
            RuleFor(x => x.ShortDescription).NotEmpty().WithMessage("Mô tả ngắn không được để trống.")
                .MaximumLength(100)
                .WithMessage("Mô tả ngắn không quá 100 ký tự.");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Mô tả không được để trống.")
              .MaximumLength(1000)
              .WithMessage("Mô tả không quá 1000 ký tự.");
            RuleFor(x => x.Address).NotEmpty().WithMessage("Địa chỉ không được để trống.")
              .MaximumLength(100)
              .WithMessage("Địa chỉ không quá 100 ký tự.");
            RuleFor(x => x.Image).NotEmpty().WithMessage("Hình ảnh không được để trống.")
              ;
        }
    }
}
