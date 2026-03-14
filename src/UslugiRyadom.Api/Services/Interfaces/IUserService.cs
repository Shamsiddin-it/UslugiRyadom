using UslugiRyadom.Api.DTOs.Users;

namespace UslugiRyadom.Api.Services.Interfaces;

public interface IUserService
{
    Task<UserResponse> GetCurrentAsync(Guid userId, CancellationToken cancellationToken);

    Task<UserResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken);
}
