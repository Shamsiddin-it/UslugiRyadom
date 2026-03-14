using Microsoft.EntityFrameworkCore;
using UslugiRyadom.Api.Data;
using UslugiRyadom.Api.DTOs.Users;
using UslugiRyadom.Api.Extensions;
using UslugiRyadom.Api.Helpers;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Services.Implementations;

public class UserService : IUserService
{
    private readonly AppDbContext _dbContext;

    public UserService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<UserResponse> GetCurrentAsync(Guid userId, CancellationToken cancellationToken)
        => GetByIdAsync(userId, cancellationToken);

    public async Task<UserResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var user = await _dbContext.Users
            .Include(x => x.MasterProfile)!
                .ThenInclude(x => x!.MasterCategories)
                    .ThenInclude(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("User not found.");

        return user.ToUserResponse();
    }
}
