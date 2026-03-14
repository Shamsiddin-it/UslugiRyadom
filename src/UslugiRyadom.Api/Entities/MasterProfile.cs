namespace UslugiRyadom.Api.Entities;

public class MasterProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Profession { get; set; } = string.Empty;

    public int Experience { get; set; }

    public string? About { get; set; }

    public decimal Rating { get; set; }

    public bool IsVerified { get; set; }

    public string? City { get; set; }

    public string? District { get; set; }

    public string? Street { get; set; }

    public string? House { get; set; }

    public string? Landmark { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ApplicationUser User { get; set; } = null!;

    public ICollection<MasterCategory> MasterCategories { get; set; } = new List<MasterCategory>();
}
