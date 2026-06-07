using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class WebsiteSettingsConfiguration : IEntityTypeConfiguration<WebsiteSettings>
  {
    public void Configure(EntityTypeBuilder<WebsiteSettings> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.Key).IsRequired().HasMaxLength(100);
      builder.Property(e => e.Category).HasMaxLength(50);
      builder.Property(e => e.DataType).HasMaxLength(20);
      builder.HasIndex(e => e.Key).IsUnique();
      builder.HasIndex(e => e.Category);
      builder.HasQueryFilter(e => !e.IsDeleted);
    }
  }
}