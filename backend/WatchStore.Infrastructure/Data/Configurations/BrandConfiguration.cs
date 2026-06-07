using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class BrandConfiguration : IEntityTypeConfiguration<Brand>
  {
    public void Configure(EntityTypeBuilder<Brand> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.Name).IsRequired().HasMaxLength(200);
      builder.HasQueryFilter(e => !e.IsDeleted);
    }
  }
}