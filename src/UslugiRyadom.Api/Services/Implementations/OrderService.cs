using Microsoft.EntityFrameworkCore;
using UslugiRyadom.Api.Data;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Orders;
using UslugiRyadom.Api.Entities;
using UslugiRyadom.Api.Enums;
using UslugiRyadom.Api.Extensions;
using UslugiRyadom.Api.Helpers;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly AppDbContext _dbContext;

    public OrderService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OrderResponse> CreateAsync(Guid clientId, CreateOrderRequest request, CancellationToken cancellationToken)
    {
        await EnsureCategoryExistsAsync(request.CategoryId, cancellationToken);

        var order = new Order
        {
            Id = Guid.NewGuid(),
            ClientId = clientId,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            CategoryId = request.CategoryId,
            City = request.City.Trim(),
            District = request.District.Trim(),
            Street = request.Street?.Trim(),
            House = request.House?.Trim(),
            Landmark = request.Landmark?.Trim(),
            Price = request.Price,
            PaymentType = request.PaymentType,
            Status = OrderStatus.New,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await GetByIdInternalAsync(order.Id, cancellationToken);
    }

    public async Task<PagedResult<OrderListItemResponse>> GetPagedAsync(OrderQueryParameters query, Guid? currentUserId, bool isAdmin, CancellationToken cancellationToken)
    {
        var orderQuery = BuildOrderQuery(query);

        if (!isAdmin && currentUserId.HasValue)
        {
            orderQuery = orderQuery.Where(x => x.ClientId == currentUserId.Value || x.MasterId == currentUserId.Value);
        }

        return await ToPagedListAsync(orderQuery, query.PageNumber, query.PageSize, cancellationToken);
    }

    public async Task<OrderResponse> GetByIdAsync(Guid id, Guid currentUserId, bool isAdmin, CancellationToken cancellationToken)
    {
        var order = await QueryBase().FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Order not found.");

        if (!isAdmin && order.ClientId != currentUserId && order.MasterId != currentUserId)
        {
            throw new ForbiddenException("You do not have access to this order.");
        }

        return order.ToOrderResponse();
    }

    public async Task<PagedResult<OrderListItemResponse>> GetMyOrdersAsync(Guid userId, PaginationQuery query, CancellationToken cancellationToken)
    {
        var orderQuery = QueryBase().Where(x => x.ClientId == userId);
        return await ToPagedListAsync(orderQuery, query.PageNumber, query.PageSize, cancellationToken);
    }

    public async Task<PagedResult<OrderListItemResponse>> GetAvailableOrdersAsync(OrderQueryParameters query, CancellationToken cancellationToken)
    {
        var orderQuery = BuildOrderQuery(query).Where(x => x.Status == OrderStatus.New);
        return await ToPagedListAsync(orderQuery, query.PageNumber, query.PageSize, cancellationToken);
    }

    public async Task<OrderResponse> AcceptAsync(Guid id, Guid masterId, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Order not found.");

        if (order.Status != OrderStatus.New)
        {
            throw new BadRequestException("Only new orders can be accepted.");
        }

        order.MasterId = masterId;
        order.Status = OrderStatus.Accepted;
        order.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return await GetByIdInternalAsync(id, cancellationToken);
    }

    public async Task<OrderResponse> UpdateStatusAsync(Guid id, Guid currentUserId, bool isAdmin, UpdateOrderStatusRequest request, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Order not found.");

        if (!isAdmin)
        {
            if (order.MasterId != currentUserId)
            {
                throw new ForbiddenException("You can update only your own accepted orders.");
            }

            var allowedStatuses = new[] { OrderStatus.Accepted, OrderStatus.InProgress, OrderStatus.Completed, OrderStatus.Cancelled };
            if (!allowedStatuses.Contains(request.Status))
            {
                throw new BadRequestException("This status is not allowed for masters.");
            }
        }

        if (order.Status == OrderStatus.Completed)
        {
            throw new BadRequestException("Completed order status cannot be changed.");
        }

        if (order.Status == OrderStatus.Cancelled && !isAdmin)
        {
            throw new BadRequestException("Cancelled order status cannot be changed.");
        }

        order.Status = request.Status;
        order.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await GetByIdInternalAsync(id, cancellationToken);
    }

    public async Task<OrderResponse> CancelAsync(Guid id, Guid currentUserId, bool isAdmin, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Order not found.");

        if (!isAdmin && order.ClientId != currentUserId && order.MasterId != currentUserId)
        {
            throw new ForbiddenException("You do not have access to this order.");
        }

        if (order.Status == OrderStatus.Completed)
        {
            throw new BadRequestException("Completed order cannot be cancelled.");
        }

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await GetByIdInternalAsync(id, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, Guid currentUserId, bool isAdmin, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Order not found.");

        if (!isAdmin && order.ClientId != currentUserId)
        {
            throw new ForbiddenException("You can delete only your own orders.");
        }

        if (order.Status != OrderStatus.New)
        {
            throw new BadRequestException("Only new orders can be deleted.");
        }

        _dbContext.Orders.Remove(order);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private IQueryable<Order> BuildOrderQuery(OrderQueryParameters query)
    {
        var orderQuery = QueryBase();

        if (query.CategoryId.HasValue)
        {
            orderQuery = orderQuery.Where(x => x.CategoryId == query.CategoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.City))
        {
            var city = query.City.Trim().ToLower();
            orderQuery = orderQuery.Where(x => x.City.ToLower() == city);
        }

        if (!string.IsNullOrWhiteSpace(query.District))
        {
            var district = query.District.Trim().ToLower();
            orderQuery = orderQuery.Where(x => x.District.ToLower() == district);
        }

        if (query.Status.HasValue)
        {
            orderQuery = orderQuery.Where(x => x.Status == query.Status.Value);
        }

        if (query.ClientId.HasValue)
        {
            orderQuery = orderQuery.Where(x => x.ClientId == query.ClientId.Value);
        }

        if (query.MasterId.HasValue)
        {
            orderQuery = orderQuery.Where(x => x.MasterId == query.MasterId.Value);
        }

        return orderQuery;
    }

    private IQueryable<Order> QueryBase()
        => _dbContext.Orders
            .AsNoTracking()
            .Include(x => x.Client)
            .Include(x => x.Master)
            .Include(x => x.Category);

    private async Task<OrderResponse> GetByIdInternalAsync(Guid id, CancellationToken cancellationToken)
        => (await QueryBase().FirstAsync(x => x.Id == id, cancellationToken)).ToOrderResponse();

    private async Task<PagedResult<OrderListItemResponse>> ToPagedListAsync(IQueryable<Order> query, int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<OrderListItemResponse>
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            Items = items.Select(x => x.ToOrderListItemResponse()).ToArray()
        };
    }

    private async Task EnsureCategoryExistsAsync(Guid categoryId, CancellationToken cancellationToken)
    {
        var exists = await _dbContext.Categories.AnyAsync(x => x.Id == categoryId, cancellationToken);
        if (!exists)
        {
            throw new NotFoundException("Category not found.");
        }
    }
}
