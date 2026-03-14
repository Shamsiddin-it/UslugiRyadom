using FluentValidation;
using UslugiRyadom.Api.DTOs.Masters;

namespace UslugiRyadom.Api.Validators;

public class UpdateMasterProfileRequestValidator : AbstractValidator<UpdateMasterProfileRequest>
{
    public UpdateMasterProfileRequestValidator()
    {
        RuleFor(x => x.Profession)
            .NotEmpty()
            .MaximumLength(150);

        RuleFor(x => x.Experience)
            .InclusiveBetween(0, 60);

        RuleFor(x => x.About)
            .MaximumLength(2000);

        RuleFor(x => x.City).MaximumLength(100);
        RuleFor(x => x.District).MaximumLength(100);
        RuleFor(x => x.Street).MaximumLength(150);
        RuleFor(x => x.House).MaximumLength(50);
        RuleFor(x => x.Landmark).MaximumLength(200);
    }
}
