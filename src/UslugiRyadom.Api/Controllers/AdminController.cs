using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UslugiRyadom.Api.Constants;
using UslugiRyadom.Api.DTOs.Admin;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Masters;
using UslugiRyadom.Api.DTOs.Orders;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = AppRoles.Admin)]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("users")]
    public async Task<ActionResult<PagedResponse<AdminUserListItemResponse>>> GetUsers([FromQuery] PaginationQuery query, CancellationToken cancellationToken)
    {
        var response = await _adminService.GetUsersAsync(query, cancellationToken);
        return Ok(PagedResponse<AdminUserListItemResponse>.Ok(response));
    }

    [HttpGet("masters")]
    public async Task<ActionResult<PagedResponse<MasterProfileResponse>>> GetMasters([FromQuery] PaginationQuery query, CancellationToken cancellationToken)
    {
        var response = await _adminService.GetMastersAsync(query, cancellationToken);
        return Ok(PagedResponse<MasterProfileResponse>.Ok(response));
    }

    [HttpGet("orders")]
    public async Task<ActionResult<PagedResponse<OrderListItemResponse>>> GetOrders([FromQuery] OrderQueryParameters query, CancellationToken cancellationToken)
    {
        var response = await _adminService.GetOrdersAsync(query, cancellationToken);
        return Ok(PagedResponse<OrderListItemResponse>.Ok(response));
    }

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<AdminStatsResponse>>> GetStats(CancellationToken cancellationToken)
    {
        var response = await _adminService.GetStatsAsync(cancellationToken);
        return Ok(ApiResponse<AdminStatsResponse>.Ok(response));
    }

    [HttpPatch("users/{id:guid}/block")]
    public async Task<ActionResult<ApiResponse<AdminUserListItemResponse>>> BlockUser(Guid id, [FromBody] UpdateBlockStatusRequest request, CancellationToken cancellationToken)
    {
        var response = await _adminService.UpdateUserBlockStatusAsync(id, request.IsBlocked, cancellationToken);
        return Ok(ApiResponse<AdminUserListItemResponse>.Ok(response, "User status updated successfully."));
    }

    [HttpPatch("masters/{id:guid}/verify")]
    public async Task<ActionResult<ApiResponse<MasterProfileResponse>>> VerifyMaster(Guid id, [FromBody] UpdateMasterVerificationRequest request, CancellationToken cancellationToken)
    {
        var response = await _adminService.UpdateMasterVerificationAsync(id, request.IsVerified, cancellationToken);
        return Ok(ApiResponse<MasterProfileResponse>.Ok(response, "Master verification updated successfully."));
    }

    [HttpDelete("categories/{id:guid}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteCategory(Guid id, CancellationToken cancellationToken)
    {
        await _adminService.DeleteCategoryAsync(id, cancellationToken);
        return Ok(ApiResponse<object>.Ok(null, "Category deleted successfully."));
    }
}
