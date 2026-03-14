using UslugiRyadom.Api.DTOs.Common;

namespace UslugiRyadom.Api.DTOs.Masters;

public class MasterQueryParameters : PaginationQuery
{
    public Guid? CategoryId { get; set; }

    public string? City { get; set; }

    public string? District { get; set; }

    public bool? IsVerified { get; set; }
}
