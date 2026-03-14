using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UslugiRyadom.Api.Entities;

namespace UslugiRyadom.Api.Data.Configurations;

public class MasterProfileConfiguration : IEntityTypeConfiguration<MasterProfile>
{
    public void Configure(EntityTypeBuilder<MasterProfile> builder)
    {
        builder.ToTable("MasterProfiles");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Profession)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.Experience).IsRequired();

        builder.Property(x => x.About).HasMaxLength(2000);

        builder.Property(x => x.Rating)
            .HasPrecision(3, 2)
            .HasDefaultValue(0m);

        builder.Property(x => x.City).HasMaxLength(100);
        builder.Property(x => x.District).HasMaxLength(100);
        builder.Property(x => x.Street).HasMaxLength(150);
        builder.Property(x => x.House).HasMaxLength(50);
        builder.Property(x => x.Landmark).HasMaxLength(200);

        builder.HasOne(x => x.User)
            .WithOne(x => x.MasterProfile)
            .HasForeignKey<MasterProfile>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
