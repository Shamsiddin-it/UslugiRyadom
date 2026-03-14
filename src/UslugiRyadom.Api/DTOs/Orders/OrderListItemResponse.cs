using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.Enums;

namespace UslugiRyadom.Api.DTOs.Orders;

public class OrderListItemResponse
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public OrderStatus Status { get; set; }

    public PaymentType PaymentType { get; set; }

    public DateTime CreatedAt { get; set; }

    public AddressDto Address { get; set; } = new();

    public CategorySummary Category { get; set; } = new();

    public UserSummary Client { get; set; } = new();

    public UserSummary? Master { get; set; }
}
