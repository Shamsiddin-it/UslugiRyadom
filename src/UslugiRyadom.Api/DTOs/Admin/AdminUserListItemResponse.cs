using UslugiRyadom.Api.Enums;

namespace UslugiRyadom.Api.DTOs.Admin;

public class AdminUserListItemResponse
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public bool IsBlocked { get; set; }

    public DateTime CreatedAt { get; set; }
}
