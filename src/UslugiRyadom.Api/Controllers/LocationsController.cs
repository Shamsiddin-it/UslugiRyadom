using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Locations;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api")]
public class LocationsController : ControllerBase
{
    private readonly ILocationService _locationService;

    public LocationsController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet("cities")]
    public async Task<ActionResult<ApiResponse<IReadOnlyCollection<CityResponse>>>> GetCities(CancellationToken cancellationToken)
    {
        var response = await _locationService.GetCitiesAsync(cancellationToken);
        return Ok(ApiResponse<IReadOnlyCollection<CityResponse>>.Ok(response));
    }

    [HttpGet("districts")]
    public async Task<ActionResult<ApiResponse<IReadOnlyCollection<DistrictResponse>>>> GetDistricts([FromQuery] string? city, [FromQuery] int? cityId, CancellationToken cancellationToken)
    {
        var response = await _locationService.GetDistrictsAsync(city, cityId, cancellationToken);
        return Ok(ApiResponse<IReadOnlyCollection<DistrictResponse>>.Ok(response));
    }
}
