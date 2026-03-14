using Microsoft.EntityFrameworkCore;
using UslugiRyadom.Api.Data;
using UslugiRyadom.Api.DTOs.Locations;
using UslugiRyadom.Api.Extensions;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Services.Implementations;

public class LocationService : ILocationService
{
    private readonly AppDbContext _dbContext;

    public LocationService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<CityResponse>> GetCitiesAsync(CancellationToken cancellationToken)
    {
        var cities = await _dbContext.Cities
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return cities.Select(x => x.ToCityResponse()).ToArray();
    }

    public async Task<IReadOnlyCollection<DistrictResponse>> GetDistrictsAsync(string? city, int? cityId, CancellationToken cancellationToken)
    {
        var query = _dbContext.Districts.AsNoTracking().Include(x => x.City).AsQueryable();

        if (cityId.HasValue)
        {
            query = query.Where(x => x.CityId == cityId.Value);
        }
        else if (!string.IsNullOrWhiteSpace(city))
        {
            var cityName = city.Trim().ToLower();
            query = query.Where(x => x.City.Name.ToLower() == cityName);
        }

        var districts = await query
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return districts.Select(x => x.ToDistrictResponse()).ToArray();
    }
}
