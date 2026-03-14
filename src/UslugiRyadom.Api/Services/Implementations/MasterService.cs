using Microsoft.EntityFrameworkCore;
using UslugiRyadom.Api.Data;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Masters;
using UslugiRyadom.Api.Entities;
using UslugiRyadom.Api.Extensions;
using UslugiRyadom.Api.Helpers;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Services.Implementations;

public class MasterService : IMasterService
{
    private readonly AppDbContext _dbContext;

    public MasterService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<MasterProfileResponse>> GetPagedAsync(MasterQueryParameters query, CancellationToken cancellationToken)
    {
        var masterQuery = QueryBase();

        if (query.CategoryId.HasValue)
        {
            masterQuery = masterQuery.Where(x => x.MasterCategories.Any(mc => mc.CategoryId == query.CategoryId.Value));
        }

        if (!string.IsNullOrWhiteSpace(query.City))
        {
            var city = query.City.Trim().ToLower();
            masterQuery = masterQuery.Where(x => x.City != null && x.City.ToLower() == city);
        }

        if (!string.IsNullOrWhiteSpace(query.District))
        {
            var district = query.District.Trim().ToLower();
            masterQuery = masterQuery.Where(x => x.District != null && x.District.ToLower() == district);
        }

        if (query.IsVerified.HasValue)
        {
            masterQuery = masterQuery.Where(x => x.IsVerified == query.IsVerified.Value);
        }

        var totalCount = await masterQuery.CountAsync(cancellationToken);
        var items = await masterQuery
            .OrderByDescending(x => x.IsVerified)
            .ThenByDescending(x => x.Rating)
            .ThenByDescending(x => x.CreatedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<MasterProfileResponse>
        {
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            Items = items.Select(x => x.ToMasterProfileResponse()).ToArray()
        };
    }

    public async Task<MasterProfileResponse> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        var profile = await QueryBase().FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken)
            ?? throw new NotFoundException("Master profile not found.");

        return profile.ToMasterProfileResponse();
    }

    public async Task<MasterProfileResponse> UpdateCurrentAsync(Guid userId, UpdateMasterProfileRequest request, CancellationToken cancellationToken)
    {
        var profile = await _dbContext.MasterProfiles
            .Include(x => x.User)
            .Include(x => x.MasterCategories)
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken)
            ?? throw new NotFoundException("Master profile not found.");

        var categories = request.CategoryIds.Count == 0
            ? []
            : await _dbContext.Categories
                .Where(x => request.CategoryIds.Contains(x.Id))
                .Select(x => x.Id)
                .ToListAsync(cancellationToken);

        profile.Profession = request.Profession.Trim();
        profile.Experience = request.Experience;
        profile.About = request.About?.Trim();
        profile.City = request.City?.Trim();
        profile.District = request.District?.Trim();
        profile.Street = request.Street?.Trim();
        profile.House = request.House?.Trim();
        profile.Landmark = request.Landmark?.Trim();

        profile.User.City = profile.City;
        profile.User.District = profile.District;
        profile.User.Street = profile.Street;
        profile.User.House = profile.House;
        profile.User.Landmark = profile.Landmark;

        _dbContext.MasterCategories.RemoveRange(profile.MasterCategories);
        profile.MasterCategories = categories.Select(categoryId => new MasterCategory
        {
            MasterProfileId = profile.Id,
            CategoryId = categoryId
        }).ToList();

        await _dbContext.SaveChangesAsync(cancellationToken);

        var updatedProfile = await QueryBase().FirstAsync(x => x.Id == profile.Id, cancellationToken);
        return updatedProfile.ToMasterProfileResponse();
    }

    private IQueryable<MasterProfile> QueryBase()
        => _dbContext.MasterProfiles
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.MasterCategories)
                .ThenInclude(x => x.Category);
}
