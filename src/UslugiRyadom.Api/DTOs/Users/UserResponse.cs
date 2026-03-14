using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Masters;
using UslugiRyadom.Api.Enums;

namespace UslugiRyadom.Api.DTOs.Users;

public class UserResponse
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public bool IsBlocked { get; set; }

    public DateTime CreatedAt { get; set; }

    public AddressDto Address { get; set; } = new();

    public MasterProfileResponse? MasterProfile { get; set; }
}
