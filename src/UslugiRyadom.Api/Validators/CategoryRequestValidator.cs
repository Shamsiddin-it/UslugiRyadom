using FluentValidation;
using UslugiRyadom.Api.DTOs.Categories;

namespace UslugiRyadom.Api.Validators;

public class CategoryRequestValidator : AbstractValidator<CategoryRequest>
{
    public CategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);
    }
}
