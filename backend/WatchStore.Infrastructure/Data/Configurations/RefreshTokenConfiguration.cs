using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
  {
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.Token).IsRequired().HasMaxLength(512);
      builder.HasIndex(e => e.Token).IsUnique();
      builder.HasIndex(e => e.UserId);
    }
  }
}