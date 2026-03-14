namespace UslugiRyadom.Api.DTOs.Masters;

public class UpdateMasterProfileRequest
{
    public string Profession { get; set; } = string.Empty;

    public int Experience { get; set; }

    public string? About { get; set; }

    public string? City { get; set; }

    public string? District { get; set; }

    public string? Street { get; set; }

    public string? House { get; set; }

    public string? Landmark { get; set; }

    public ICollection<Guid> CategoryIds { get; set; } = [];
}
