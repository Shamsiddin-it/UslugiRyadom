namespace UslugiRyadom.Api.Entities;

public class Category
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<MasterCategory> MasterCategories { get; set; } = new List<MasterCategory>();

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
