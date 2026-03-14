using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UslugiRyadom.Api.Constants;
using UslugiRyadom.Api.DTOs.Categories;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<IReadOnlyCollection<CategoryResponse>>>> GetAll(CancellationToken cancellationToken)
    {
        var response = await _categoryService.GetAllAsync(cancellationToken);
        return Ok(ApiResponse<IReadOnlyCollection<CategoryResponse>>.Ok(response));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<CategoryResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var response = await _categoryService.GetByIdAsync(id, cancellationToken);
        return Ok(ApiResponse<CategoryResponse>.Ok(response));
    }

    [HttpPost]
    [Authorize(Roles = AppRoles.Admin)]
    public async Task<ActionResult<ApiResponse<CategoryResponse>>> Create([FromBody] CategoryRequest request, CancellationToken cancellationToken)
    {
        var response = await _categoryService.CreateAsync(request, cancellationToken);
        return Ok(ApiResponse<CategoryResponse>.Ok(response, "Category created successfully."));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = AppRoles.Admin)]
    public async Task<ActionResult<ApiResponse<CategoryResponse>>> Update(Guid id, [FromBody] CategoryRequest request, CancellationToken cancellationToken)
    {
        var response = await _categoryService.UpdateAsync(id, request, cancellationToken);
        return Ok(ApiResponse<CategoryResponse>.Ok(response, "Category updated successfully."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = AppRoles.Admin)]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _categoryService.DeleteAsync(id, cancellationToken);
        return Ok(ApiResponse<object>.Ok(null, "Category deleted successfully."));
    }
}
