using UslugiRyadom.Api.DTOs.Locations;

namespace UslugiRyadom.Api.Services.Interfaces;

public interface ILocationService
{
    Task<IReadOnlyCollection<CityResponse>> GetCitiesAsync(CancellationToken cancellationToken);

    Task<IReadOnlyCollection<DistrictResponse>> GetDistrictsAsync(string? city, int? cityId, CancellationToken cancellationToken);
}
