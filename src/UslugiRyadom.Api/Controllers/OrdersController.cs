using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UslugiRyadom.Api.Constants;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Orders;
using UslugiRyadom.Api.Extensions;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    [Authorize(Roles = AppRoles.Client)]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> Create([FromBody] CreateOrderRequest request, CancellationToken cancellationToken)
    {
        var response = await _orderService.CreateAsync(User.GetUserId(), request, cancellationToken);
        return Ok(ApiResponse<OrderResponse>.Ok(response, "Order created successfully."));
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<OrderListItemResponse>>> GetAll([FromQuery] OrderQueryParameters query, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var isAdmin = User.IsInRole(AppRoles.Admin);
        var response = await _orderService.GetPagedAsync(query, userId, isAdmin, cancellationToken);
        return Ok(PagedResponse<OrderListItemResponse>.Ok(response));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var response = await _orderService.GetByIdAsync(id, User.GetUserId(), User.IsInRole(AppRoles.Admin), cancellationToken);
        return Ok(ApiResponse<OrderResponse>.Ok(response));
    }

    [HttpGet("my")]
    [Authorize(Roles = AppRoles.Client)]
    public async Task<ActionResult<PagedResponse<OrderListItemResponse>>> GetMy([FromQuery] PaginationQuery query, CancellationToken cancellationToken)
    {
        var response = await _orderService.GetMyOrdersAsync(User.GetUserId(), query, cancellationToken);
        return Ok(PagedResponse<OrderListItemResponse>.Ok(response));
    }

    [HttpGet("available")]
    [Authorize(Roles = AppRoles.Master)]
    public async Task<ActionResult<PagedResponse<OrderListItemResponse>>> GetAvailable([FromQuery] OrderQueryParameters query, CancellationToken cancellationToken)
    {
        var response = await _orderService.GetAvailableOrdersAsync(query, cancellationToken);
        return Ok(PagedResponse<OrderListItemResponse>.Ok(response));
    }

    [HttpPost("{id:guid}/accept")]
    [Authorize(Roles = AppRoles.Master)]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> Accept(Guid id, CancellationToken cancellationToken)
    {
        var response = await _orderService.AcceptAsync(id, User.GetUserId(), cancellationToken);
        return Ok(ApiResponse<OrderResponse>.Ok(response, "Order accepted successfully."));
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = $"{AppRoles.Master},{AppRoles.Admin}")]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusRequest request, CancellationToken cancellationToken)
    {
        var response = await _orderService.UpdateStatusAsync(id, User.GetUserId(), User.IsInRole(AppRoles.Admin), request, cancellationToken);
        return Ok(ApiResponse<OrderResponse>.Ok(response, "Order status updated successfully."));
    }

    [HttpPatch("{id:guid}/cancel")]
    [Authorize(Roles = $"{AppRoles.Client},{AppRoles.Master},{AppRoles.Admin}")]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> Cancel(Guid id, CancellationToken cancellationToken)
    {
        var response = await _orderService.CancelAsync(id, User.GetUserId(), User.IsInRole(AppRoles.Admin), cancellationToken);
        return Ok(ApiResponse<OrderResponse>.Ok(response, "Order cancelled successfully."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = $"{AppRoles.Client},{AppRoles.Admin}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _orderService.DeleteAsync(id, User.GetUserId(), User.IsInRole(AppRoles.Admin), cancellationToken);
        return Ok(ApiResponse<object>.Ok(null, "Order deleted successfully."));
    }
}
