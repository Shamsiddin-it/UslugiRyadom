namespace UslugiRyadom.Api.Services.Interfaces;

public interface IDataSeeder
{
    Task SeedAsync(CancellationToken cancellationToken);
}
