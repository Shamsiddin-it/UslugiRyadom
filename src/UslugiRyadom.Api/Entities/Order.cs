using UslugiRyadom.Api.Enums;

namespace UslugiRyadom.Api.Entities;

public class Order
{
    public Guid Id { get; set; }

    public Guid ClientId { get; set; }

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

    public OrderStatus Status { get; set; } = OrderStatus.New;

    public Guid? MasterId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ApplicationUser Client { get; set; } = null!;

    public ApplicationUser? Master { get; set; }

    public Category Category { get; set; } = null!;
}
