using FluentValidation;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Validators
{
    public class CreateOrderValidator : AbstractValidator<CreateOrderDto>
    {
        public CreateOrderValidator()
        {
            RuleFor(x => x.ShippingAddress)
                .NotEmpty().WithMessage("Shipping address is required")
                .MaximumLength(500).WithMessage("Shipping address cannot exceed 500 characters");

            RuleFor(x => x.Notes)
                .MaximumLength(1000).WithMessage("Notes cannot exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.Notes));

            RuleFor(x => x.OrderItems)
                .NotEmpty().WithMessage("Order must contain at least one item")
                .Must(items => items.Count <= 50).WithMessage("Order cannot contain more than 50 items");

            RuleForEach(x => x.OrderItems).ChildRules(item =>
            {
                item.RuleFor(i => i.WatchId)
                    .GreaterThan(0).WithMessage("Watch ID is required");

                item.RuleFor(i => i.Quantity)
                    .GreaterThan(0).WithMessage("Quantity must be greater than 0")
                    .LessThanOrEqualTo(100).WithMessage("Quantity per item cannot exceed 100");
            });
        }
    }
}
