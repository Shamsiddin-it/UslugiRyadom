using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Orders;

namespace UslugiRyadom.Api.Services.Interfaces;

public interface IOrderService
{
    Task<OrderResponse> CreateAsync(Guid clientId, CreateOrderRequest request, CancellationToken cancellationToken);

    Task<PagedResult<OrderListItemResponse>> GetPagedAsync(OrderQueryParameters query, Guid? currentUserId, bool isAdmin, CancellationToken cancellationToken);

    Task<OrderResponse> GetByIdAsync(Guid id, Guid currentUserId, bool isAdmin, CancellationToken cancellationToken);

    Task<PagedResult<OrderListItemResponse>> GetMyOrdersAsync(Guid userId, PaginationQuery query, CancellationToken cancellationToken);

    Task<PagedResult<OrderListItemResponse>> GetAvailableOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken);

    Task<OrderResponse> AcceptAsync(Guid id, Guid masterId, CancellationToken cancellationToken);

    Task<OrderResponse> UpdateStatusAsync(Guid id, Guid currentUserId, bool isAdmin, UpdateOrderStatusRequest request, CancellationToken cancellationToken);

    Task<OrderResponse> CancelAsync(Guid id, Guid currentUserId, bool isAdmin, CancellationToken cancellationToken);

    Task DeleteAsync(Guid id, Guid currentUserId, bool isAdmin, CancellationToken cancellationToken);
}
