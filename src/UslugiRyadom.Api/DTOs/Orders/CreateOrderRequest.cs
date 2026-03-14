using UslugiRyadom.Api.Enums;

namespace UslugiRyadom.Api.DTOs.Orders;

public class CreateOrderRequest
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public Guid CategoryId { get; set; }

    public string City { get; set; } = string.Empty;

    public string District { get; set; } = string.Empty;

    public string? Street { get; set; }

    public string? House { get; set; }

    public string? Landmark { get; set; }

    public decimal Price { get; set; }

    public PaymentType PaymentType { get; set; }
}
