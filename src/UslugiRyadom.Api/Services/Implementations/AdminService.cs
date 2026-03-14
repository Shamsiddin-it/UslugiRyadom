using Microsoft.EntityFrameworkCore;
using UslugiRyadom.Api.Data;
using UslugiRyadom.Api.DTOs.Admin;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Masters;
using UslugiRyadom.Api.DTOs.Orders;
using UslugiRyadom.Api.Enums;
using UslugiRyadom.Api.Extensions;
using UslugiRyadom.Api.Helpers;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Services.Implementations;

public class AdminService : IAdminService
{
    private readonly AppDbContext _dbContext;

    public AdminService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<AdminUserListItemResponse>> GetUsersAsync(PaginationQuery query, CancellationToken cancellationToken)
    {
        var usersQuery = _dbContext.Users.AsNoTracking();
        var totalCount = await usersQuery.CountAsync(cancellationToken);

        var items = await usersQuery
            .OrderByDescending(x => x.CreatedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(x => new AdminUserListItemResponse
            {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.Email ?? string.Empty,
                Phone = x.PhoneNumber ?? string.Empty,
                Role = x.Role,
                IsBlocked = x.IsBlocked,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<AdminUserListItemResponse>
        {
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            Items = items
        };
    }

    public async Task<PagedResult<MasterProfileResponse>> GetMastersAsync(PaginationQuery query, CancellationToken cancellationToken)
    {
        var mastersQuery = _dbContext.MasterProfiles
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.MasterCategories)
                .ThenInclude(x => x.Category);

        var totalCount = await mastersQuery.CountAsync(cancellationToken);
        var items = await mastersQuery
            .OrderByDescending(x => x.CreatedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<MasterProfileResponse>
        {
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            Items = items.Select(x => x.ToMasterProfileResponse()).ToArray()
        };
    }

    public async Task<PagedResult<OrderListItemResponse>> GetOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken)
    {
        var orderQuery = _dbContext.Orders
            .AsNoTracking()
            .Include(x => x.Client)
            .Include(x => x.Master)
            .Include(x => x.Category)
            .AsQueryable();

        if (query.CategoryId.HasValue)
        {
            orderQuery = orderQuery.Where(x => x.CategoryId == query.CategoryId.Value);
        }

        if (query.Status.HasValue)
        {
            orderQuery = orderQuery.Where(x => x.Status == query.Status.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.City))
        {
            var city = query.City.Trim().ToLower();
            orderQuery = orderQuery.Where(x => x.City.ToLower() == city);
        }

        var totalCount = await orderQuery.CountAsync(cancellationToken);
        var items = await orderQuery
            .OrderByDescending(x => x.CreatedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<OrderListItemResponse>
        {
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            Items = items.Select(x => x.ToOrderListItemResponse()).ToArray()
        };
    }

    public async Task<AdminStatsResponse> GetStatsAsync(CancellationToken cancellationToken)
    {
        return new AdminStatsResponse
        {
            TotalUsers = await _dbContext.Users.CountAsync(cancellationToken),
            TotalClients = await _dbContext.Users.CountAsync(x => x.Role == UserRole.Client, cancellationToken),
            TotalMasters = await _dbContext.Users.CountAsync(x => x.Role == UserRole.Master, cancellationToken),
            VerifiedMasters = await _dbContext.MasterProfiles.CountAsync(x => x.IsVerified, cancellationToken),
            TotalOrders = await _dbContext.Orders.CountAsync(cancellationToken),
            ActiveOrders = await _dbContext.Orders.CountAsync(x => x.Status == OrderStatus.New || x.Status == OrderStatus.Accepted || x.Status == OrderStatus.InProgress, cancellationToken),
            CompletedOrders = await _dbContext.Orders.CountAsync(x => x.Status == OrderStatus.Completed, cancellationToken),
            CancelledOrders = await _dbContext.Orders.CountAsync(x => x.Status == OrderStatus.Cancelled, cancellationToken),
            TotalCategories = await _dbContext.Categories.CountAsync(cancellationToken)
        };
    }

    public async Task<AdminUserListItemResponse> UpdateUserBlockStatusAsync(Guid userId, bool isBlocked, CancellationToken cancellationToken)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId, cancellationToken)
            ?? throw new NotFoundException("User not found.");

        user.IsBlocked = isBlocked;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new AdminUserListItemResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            Phone = user.PhoneNumber ?? string.Empty,
            Role = user.Role,
            IsBlocked = user.IsBlocked,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<MasterProfileResponse> UpdateMasterVerificationAsync(Guid masterUserId, bool isVerified, CancellationToken cancellationToken)
    {
        var master = await _dbContext.MasterProfiles
            .Include(x => x.User)
            .Include(x => x.MasterCategories)
                .ThenInclude(x => x.Category)
            .FirstOrDefaultAsync(x => x.UserId == masterUserId, cancellationToken)
            ?? throw new NotFoundException("Master not found.");

        master.IsVerified = isVerified;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return master.ToMasterProfileResponse();
    }

    public async Task DeleteCategoryAsync(Guid categoryId, CancellationToken cancellationToken)
    {
        var category = await _dbContext.Categories.FirstOrDefaultAsync(x => x.Id == categoryId, cancellationToken)
            ?? throw new NotFoundException("Category not found.");

        var isUsed = await _dbContext.Orders.AnyAsync(x => x.CategoryId == categoryId, cancellationToken)
            || await _dbContext.MasterCategories.AnyAsync(x => x.CategoryId == categoryId, cancellationToken);

        if (isUsed)
        {
            throw new BadRequestException("Category cannot be deleted because it is already used.");
        }

        _dbContext.Categories.Remove(category);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
