using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Masters;

namespace UslugiRyadom.Api.Services.Interfaces;

public interface IMasterService
{
    Task<PagedResult<MasterProfileResponse>> GetPagedAsync(MasterQueryParameters query, CancellationToken cancellationToken);

    Task<MasterProfileResponse> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);

    Task<MasterProfileResponse> UpdateCurrentAsync(Guid userId, UpdateMasterProfileRequest request, CancellationToken cancellationToken);
}
