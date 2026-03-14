using FluentValidation;
using UslugiRyadom.Api.DTOs.Auth;
using UslugiRyadom.Api.Enums;

namespace UslugiRyadom.Api.Validators;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(256);

        RuleFor(x => x.Phone)
            .NotEmpty()
            .Matches(@"^\+?[0-9]{9,15}$")
            .WithMessage("Phone must be a valid phone number.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(100);

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password)
            .WithMessage("Password confirmation does not match.");

        RuleFor(x => x.Role)
            .IsInEnum()
            .Must(role => role is UserRole.Client or UserRole.Master)
            .WithMessage("Registration is allowed only for client or master roles.");

        RuleFor(x => x.City).MaximumLength(100);
        RuleFor(x => x.District).MaximumLength(100);
        RuleFor(x => x.Street).MaximumLength(150);
        RuleFor(x => x.House).MaximumLength(50);
        RuleFor(x => x.Landmark).MaximumLength(200);

        When(x => x.Role == UserRole.Master, () =>
        {
            RuleFor(x => x.Profession)
                .NotEmpty()
                .MaximumLength(150);

            RuleFor(x => x.Experience)
                .NotNull()
                .InclusiveBetween(0, 60);

            RuleFor(x => x.About)
                .MaximumLength(2000);
        });
    }
}
