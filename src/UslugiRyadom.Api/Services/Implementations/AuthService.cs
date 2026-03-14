using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UslugiRyadom.Api.Constants;
using UslugiRyadom.Api.Data;
using UslugiRyadom.Api.DTOs.Auth;
using UslugiRyadom.Api.Entities;
using UslugiRyadom.Api.Enums;
using UslugiRyadom.Api.Extensions;
using UslugiRyadom.Api.Helpers;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        AppDbContext dbContext,
        UserManager<ApplicationUser> userManager,
        IJwtTokenService jwtTokenService)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        if (await _userManager.Users.AnyAsync(x => x.Email == request.Email, cancellationToken))
        {
            throw new BadRequestException("A user with this email already exists.");
        }

        if (await _userManager.Users.AnyAsync(x => x.PhoneNumber == request.Phone, cancellationToken))
        {
            throw new BadRequestException("A user with this phone number already exists.");
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            UserName = request.Email.Trim().ToLowerInvariant(),
            PhoneNumber = request.Phone.Trim(),
            Role = request.Role,
            City = request.City?.Trim(),
            District = request.District?.Trim(),
            Street = request.Street?.Trim(),
            House = request.House?.Trim(),
            Landmark = request.Landmark?.Trim(),
            CreatedAt = DateTime.UtcNow,
            EmailConfirmed = true,
            PhoneNumberConfirmed = true
        };

        var creationResult = await _userManager.CreateAsync(user, request.Password);
        if (!creationResult.Succeeded)
        {
            throw ToBadRequest(creationResult);
        }

        var roleName = request.Role switch
        {
            UserRole.Client => AppRoles.Client,
            UserRole.Master => AppRoles.Master,
            _ => throw new BadRequestException("Invalid role for registration.")
        };

        var roleResult = await _userManager.AddToRoleAsync(user, roleName);
        if (!roleResult.Succeeded)
        {
            throw ToBadRequest(roleResult);
        }

        if (request.Role == UserRole.Master)
        {
            var categories = request.CategoryIds.Count == 0
                ? []
                : await _dbContext.Categories
                    .Where(x => request.CategoryIds.Contains(x.Id))
                    .Select(x => x.Id)
                    .ToListAsync(cancellationToken);

            var profile = new MasterProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Profession = request.Profession!.Trim(),
                Experience = request.Experience ?? 0,
                About = request.About?.Trim(),
                Rating = 0m,
                IsVerified = false,
                City = user.City,
                District = user.District,
                Street = user.Street,
                House = user.House,
                Landmark = user.Landmark,
                CreatedAt = DateTime.UtcNow,
                MasterCategories = categories.Select(categoryId => new MasterCategory
                {
                    CategoryId = categoryId
                }).ToList()
            };

            _dbContext.MasterProfiles.Add(profile);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return await BuildAuthResponseAsync(user.Id, cancellationToken);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _userManager.Users
            .Include(x => x.MasterProfile)!
                .ThenInclude(x => x!.MasterCategories)
                    .ThenInclude(x => x.Category)
            .FirstOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken)
            ?? throw new UnauthorizedAppException("Invalid email or password.");

        if (user.IsBlocked)
        {
            throw new ForbiddenException("User is blocked.");
        }

        var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!passwordValid)
        {
            throw new UnauthorizedAppException("Invalid email or password.");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var (token, expiresAt) = _jwtTokenService.GenerateToken(user, roles);

        return new AuthResponse
        {
            AccessToken = token,
            ExpiresAt = expiresAt,
            User = user.ToCurrentUserResponse()
        };
    }

    public Task LogoutAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    public async Task<CurrentUserResponse> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await GetUserWithProfileAsync(userId, cancellationToken);
        return user.ToCurrentUserResponse();
    }

    private async Task<AuthResponse> BuildAuthResponseAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await GetUserWithProfileAsync(userId, cancellationToken);
        var roles = await _userManager.GetRolesAsync(user);
        var (token, expiresAt) = _jwtTokenService.GenerateToken(user, roles);

        return new AuthResponse
        {
            AccessToken = token,
            ExpiresAt = expiresAt,
            User = user.ToCurrentUserResponse()
        };
    }

    private async Task<ApplicationUser> GetUserWithProfileAsync(Guid userId, CancellationToken cancellationToken)
        => await _userManager.Users
            .Include(x => x.MasterProfile)!
                .ThenInclude(x => x!.MasterCategories)
                    .ThenInclude(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken)
            ?? throw new NotFoundException("User not found.");

    private static BadRequestException ToBadRequest(IdentityResult identityResult)
    {
        var errors = identityResult.Errors
            .GroupBy(x => x.Code)
            .ToDictionary(x => x.Key, x => x.Select(e => e.Description).ToArray());

        return new BadRequestException("Identity operation failed.", errors);
    }
}
