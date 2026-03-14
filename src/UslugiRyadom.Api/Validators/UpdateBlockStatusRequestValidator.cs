using FluentValidation;
using UslugiRyadom.Api.DTOs.Admin;

namespace UslugiRyadom.Api.Validators;

public class UpdateBlockStatusRequestValidator : AbstractValidator<UpdateBlockStatusRequest>
{
    public UpdateBlockStatusRequestValidator()
    {
        RuleFor(x => x.IsBlocked).NotNull();
    }
}
