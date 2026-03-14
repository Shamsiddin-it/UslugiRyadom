using UslugiRyadom.Api.DTOs.Common;

namespace UslugiRyadom.Api.DTOs.Masters;

public class MasterProfileResponse
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Profession { get; set; } = string.Empty;

    public int Experience { get; set; }

    public string? About { get; set; }

    public decimal Rating { get; set; }

    public bool IsVerified { get; set; }

    public DateTime CreatedAt { get; set; }

    public AddressDto Address { get; set; } = new();

    public IReadOnlyCollection<MasterCategoryResponse> Categories { get; set; } = [];
}
