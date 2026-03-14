namespace UslugiRyadom.Api.Entities;

public class MasterCategory
{
    public Guid MasterProfileId { get; set; }

    public Guid CategoryId { get; set; }

    public MasterProfile MasterProfile { get; set; } = null!;

    public Category Category { get; set; } = null!;
}
