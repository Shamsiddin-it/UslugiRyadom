# Uslugi Ryadom Backend

Production-ready ASP.NET Core Web API MVP for the `Услуги рядом` service.

## Stack

- .NET 8
- ASP.NET Core Web API
- PostgreSQL
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
2. Update PostgreSQL connection string.
3. Set a strong JWT key with at least 32 characters.

## Run

1. Create PostgreSQL database:

```sql
CREATE DATABASE uslugi_ryadom_db;
```

2. Restore packages:

```bash
dotnet restore src/UslugiRyadom.Api/UslugiRyadom.Api.csproj
```

3. Apply migrations:

```bash
dotnet ef database update --project src/UslugiRyadom.Api/UslugiRyadom.Api.csproj
```

4. Start the API:

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
- JWT can be tested directly in Swagger using the `Authorize` button.
- The architecture is prepared for future modules like reviews, chat, images, geolocation, and online payments.
