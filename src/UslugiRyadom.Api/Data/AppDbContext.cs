using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UslugiRyadom.Api.Entities;

namespace UslugiRyadom.Api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<MasterProfile> MasterProfiles => Set<MasterProfile>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<MasterCategory> MasterCategories => Set<MasterCategory>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<City> Cities => Set<City>();

    public DbSet<District> Districts => Set<District>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        builder.Entity<IdentityRole<Guid>>().HasData(
            new IdentityRole<Guid>
            {
                Id = Guid.Parse("f2d5d628-e57f-4a1f-9b65-24e3ea02f121"),
                Name = "Admin",
                NormalizedName = "ADMIN",
                ConcurrencyStamp = "ba3df7f7-8d5e-46cc-8701-17a79b129211"
            },
            new IdentityRole<Guid>
            {
                Id = Guid.Parse("0ef1f5a5-52dd-425a-a19d-d2934aef969d"),
                Name = "Client",
                NormalizedName = "CLIENT",
                ConcurrencyStamp = "d649a856-cc9f-4f61-a445-8d5701cf9724"
            },
            new IdentityRole<Guid>
            {
                Id = Guid.Parse("de27c051-663d-4990-b0fe-b8b5e4677f33"),
                Name = "Master",
                NormalizedName = "MASTER",
                ConcurrencyStamp = "eefb83a2-f129-46d7-9af0-0b824d7890af"
            });
    }
}
