using Application.ViewModels.FeedbackViewModels;
using FluentValidation;

namespace WebAPI.Validations.Feedbacks
{
    public class FeedbackCreateValidator:AbstractValidator<FeedbackCreateModel>
    {
        public FeedbackCreateValidator()
        {


            RuleFor(x => x.Rating).NotEmpty().WithMessage("Đánh giá không được để trống.");


            RuleFor(x => x.FeedbackText).NotEmpty().WithMessage("Đánh giá không được để trống.");
            
        }
    }
}
