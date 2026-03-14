using UslugiRyadom.Api.Enums;

namespace UslugiRyadom.Api.DTOs.Orders;

public class UpdateOrderStatusRequest
{
    public OrderStatus Status { get; set; }
}
