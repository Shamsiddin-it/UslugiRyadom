using UslugiRyadom.Api.Enums;

namespace UslugiRyadom.Api.DTOs.Orders;

public class UserSummary
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public UserRole Role { get; set; }
}
