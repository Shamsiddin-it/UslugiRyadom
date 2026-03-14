using Microsoft.EntityFrameworkCore;
using UslugiRyadom.Api.Data;
using UslugiRyadom.Api.DTOs.Categories;
using UslugiRyadom.Api.Extensions;
using UslugiRyadom.Api.Helpers;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _dbContext;

    public CategoryService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<CategoryResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var categories = await _dbContext.Categories
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return categories.Select(x => x.ToCategoryResponse()).ToArray();
    }

    public async Task<CategoryResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var category = await _dbContext.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Category not found.");

        return category.ToCategoryResponse();
    }

    public async Task<CategoryResponse> CreateAsync(CategoryRequest request, CancellationToken cancellationToken)
    {
        var normalizedName = request.Name.Trim();
        var slug = SlugHelper.Generate(normalizedName);
        var exists = await _dbContext.Categories.AnyAsync(x => x.Name == normalizedName || x.Slug == slug, cancellationToken);
        if (exists)
        {
            throw new BadRequestException("Category with the same name already exists.");
        }

        var category = new Entities.Category
        {
            Id = Guid.NewGuid(),
            Name = normalizedName,
            Slug = slug,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Categories.Add(category);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return category.ToCategoryResponse();
    }

    public async Task<CategoryResponse> UpdateAsync(Guid id, CategoryRequest request, CancellationToken cancellationToken)
    {
        var category = await _dbContext.Categories.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Category not found.");

        var normalizedName = request.Name.Trim();
        var slug = SlugHelper.Generate(normalizedName);
        var exists = await _dbContext.Categories.AnyAsync(x => x.Id != id && (x.Name == normalizedName || x.Slug == slug), cancellationToken);
        if (exists)
        {
            throw new BadRequestException("Category with the same name already exists.");
        }

        category.Name = normalizedName;
        category.Slug = slug;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return category.ToCategoryResponse();
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var category = await _dbContext.Categories.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Category not found.");

        var isUsed = await _dbContext.Orders.AnyAsync(x => x.CategoryId == id, cancellationToken)
            || await _dbContext.MasterCategories.AnyAsync(x => x.CategoryId == id, cancellationToken);

        if (isUsed)
        {
            throw new BadRequestException("Category cannot be deleted because it is already used.");
        }

        _dbContext.Categories.Remove(category);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
