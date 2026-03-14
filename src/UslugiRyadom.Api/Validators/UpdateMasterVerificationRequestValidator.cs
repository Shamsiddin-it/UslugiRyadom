using FluentValidation;
using UslugiRyadom.Api.DTOs.Admin;

namespace UslugiRyadom.Api.Validators;

public class UpdateMasterVerificationRequestValidator : AbstractValidator<UpdateMasterVerificationRequest>
{
    public UpdateMasterVerificationRequestValidator()
    {
        RuleFor(x => x.IsVerified).NotNull();
    }
}
