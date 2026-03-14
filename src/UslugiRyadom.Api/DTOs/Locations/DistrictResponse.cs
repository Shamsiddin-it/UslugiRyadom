namespace UslugiRyadom.Api.DTOs.Locations;

public class DistrictResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int CityId { get; set; }
}
