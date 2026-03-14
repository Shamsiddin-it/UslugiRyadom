using UslugiRyadom.Api.Enums;

namespace UslugiRyadom.Api.DTOs.Auth;

public class RegisterRequest
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string ConfirmPassword { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Client;

    public string? City { get; set; }

    public string? District { get; set; }

    public string? Street { get; set; }

    public string? House { get; set; }

    public string? Landmark { get; set; }

    public string? Profession { get; set; }

    public int? Experience { get; set; }

    public string? About { get; set; }

    public ICollection<Guid> CategoryIds { get; set; } = [];
}
