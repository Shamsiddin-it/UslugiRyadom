using FluentValidation;
using UslugiRyadom.Api.DTOs.Orders;

namespace UslugiRyadom.Api.Validators;

public class UpdateOrderStatusRequestValidator : AbstractValidator<UpdateOrderStatusRequest>
{
    public UpdateOrderStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum();
    }
}
