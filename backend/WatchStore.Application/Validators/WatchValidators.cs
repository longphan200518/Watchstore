using FluentValidation;
using WatchStore.Application.DTOs;
using WatchStore.Domain.Enums;

namespace WatchStore.Application.Validators
{
    public class CreateWatchValidator : AbstractValidator<CreateWatchDto>
    {
        public CreateWatchValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Watch name is required")
                .MaximumLength(300).WithMessage("Watch name cannot exceed 300 characters");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0")
                .LessThanOrEqualTo(1_000_000_000).WithMessage("Price is too high");

            RuleFor(x => x.StockQuantity)
                .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative")
                .LessThanOrEqualTo(100_000).WithMessage("Stock quantity is too high");

            RuleFor(x => x.BrandId)
                .GreaterThan(0).WithMessage("Brand ID is required");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid watch status");
        }
    }

    public class UpdateWatchValidator : AbstractValidator<UpdateWatchDto>
    {
        public UpdateWatchValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Watch ID is required");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Watch name is required")
                .MaximumLength(200).WithMessage("Watch name cannot exceed 200 characters");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0")
                .LessThanOrEqualTo(1_000_000_000).WithMessage("Price is too high");

            RuleFor(x => x.StockQuantity)
                .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative")
                .LessThanOrEqualTo(100_000).WithMessage("Stock quantity is too high");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid watch status");
        }
    }
}
