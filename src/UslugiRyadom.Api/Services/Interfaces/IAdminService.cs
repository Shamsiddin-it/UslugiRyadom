using UslugiRyadom.Api.DTOs.Admin;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Masters;
using UslugiRyadom.Api.DTOs.Orders;

namespace UslugiRyadom.Api.Services.Interfaces;

public interface IAdminService
{
    Task<PagedResult<AdminUserListItemResponse>> GetUsersAsync(PaginationQuery query, CancellationToken cancellationToken);

    Task<PagedResult<MasterProfileResponse>> GetMastersAsync(PaginationQuery query, CancellationToken cancellationToken);

    Task<PagedResult<OrderListItemResponse>> GetOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken);

    Task<AdminStatsResponse> GetStatsAsync(CancellationToken cancellationToken);

    Task<AdminUserListItemResponse> UpdateUserBlockStatusAsync(Guid userId, bool isBlocked, CancellationToken cancellationToken);

    Task<MasterProfileResponse> UpdateMasterVerificationAsync(Guid masterUserId, bool isVerified, CancellationToken cancellationToken);

    Task DeleteCategoryAsync(Guid categoryId, CancellationToken cancellationToken);
}
