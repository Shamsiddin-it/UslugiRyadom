using Microsoft.AspNetCore.Identity;
using UslugiRyadom.Api.Enums;

namespace UslugiRyadom.Api.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Client;

    public string? City { get; set; }

    public string? District { get; set; }

    public string? Street { get; set; }

    public string? House { get; set; }

    public string? Landmark { get; set; }

    public bool IsBlocked { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public MasterProfile? MasterProfile { get; set; }

    public ICollection<Order> ClientOrders { get; set; } = new List<Order>();

    public ICollection<Order> AcceptedOrders { get; set; } = new List<Order>();
}
