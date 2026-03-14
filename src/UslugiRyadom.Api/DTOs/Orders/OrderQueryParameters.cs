using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.Enums;

namespace UslugiRyadom.Api.DTOs.Orders;

public class OrderQueryParameters : PaginationQuery
{
    public Guid? CategoryId { get; set; }

    public string? City { get; set; }

    public string? District { get; set; }

    public OrderStatus? Status { get; set; }

    public Guid? ClientId { get; set; }

    public Guid? MasterId { get; set; }
}
