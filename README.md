# Uslugi Ryadom Backend

Production-ready ASP.NET Core Web API MVP for the `Услуги рядом` service.

## Stack

- .NET 10
- ASP.NET Core Web API
- SQLite
- Entity Framework Core
- ASP.NET Core Identity + JWT
- FluentValidation
- Swagger / OpenAPI
- Serilog

## Project Structure

```text
UslugiRyadom/
├── README.md
├── UslugiRyadom.slnx
└── src/
    └── UslugiRyadom.Api/
        ├── Constants/
        ├── Controllers/
        ├── Data/
        │   ├── Configurations/
        │   └── Seeds/
        ├── DTOs/
        │   ├── Admin/
        │   ├── Auth/
        │   ├── Categories/
        │   ├── Common/
        │   ├── Locations/
        │   ├── Masters/
        │   ├── Orders/
        │   └── Users/
        ├── Entities/
        ├── Enums/
        ├── Extensions/
        ├── Helpers/
        ├── Middleware/
        ├── Migrations/
        ├── Options/
        ├── Services/
        │   ├── Implementations/
        │   └── Interfaces/
        ├── Validators/
        ├── Program.cs
        ├── appsettings.json
        ├── appsettings.json.example
        └── UslugiRyadom.Api.csproj
```

## Configuration

1. Copy `src/UslugiRyadom.Api/appsettings.json.example` to `src/UslugiRyadom.Api/appsettings.json` if you want your own local settings.
2. Update SQLite connection string if you want the database file in another location.
3. Set a strong JWT key with at least 32 characters.

## Run

1. Restore packages and local tools:

```bash
dotnet restore src/UslugiRyadom.Api/UslugiRyadom.Api.csproj
dotnet tool restore
```

2. Apply migrations:

```bash
dotnet tool run dotnet-ef database update --project src/UslugiRyadom.Api/UslugiRyadom.Api.csproj
```

3. Start the API:

```bash
dotnet run --project src/UslugiRyadom.Api/UslugiRyadom.Api.csproj
```

Swagger UI is available in Development mode.

## Seeded Users

- `admin@test.com / Admin123!`
- `client1@test.com / Client123!`
- `client2@test.com / Client123!`
- `master1@test.com / Master123!`
- `master2@test.com / Master123!`

## Notes

- Seed runs on startup and is idempotent.
- SQLite database file is created automatically from the `DefaultConnection` path.
- JWT can be tested directly in Swagger using the `Authorize` button.
- The architecture is prepared for future modules like reviews, chat, images, geolocation, and online payments.
