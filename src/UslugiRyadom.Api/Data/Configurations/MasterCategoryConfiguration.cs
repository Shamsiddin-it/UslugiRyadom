using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UslugiRyadom.Api.Entities;

namespace UslugiRyadom.Api.Data.Configurations;

public class MasterCategoryConfiguration : IEntityTypeConfiguration<MasterCategory>
{
    public void Configure(EntityTypeBuilder<MasterCategory> builder)
    {
        builder.ToTable("MasterCategories");

        builder.HasKey(x => new { x.MasterProfileId, x.CategoryId });

        builder.HasOne(x => x.MasterProfile)
            .WithMany(x => x.MasterCategories)
            .HasForeignKey(x => x.MasterProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Category)
            .WithMany(x => x.MasterCategories)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
