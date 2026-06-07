using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class WatchImageConfiguration : IEntityTypeConfiguration<WatchImage>
  {
    public void Configure(EntityTypeBuilder<WatchImage> builder)
    {
      builder.HasKey(e => e.Id);
      builder.HasOne(e => e.Watch)
          .WithMany(w => w.Images)
          .HasForeignKey(e => e.WatchId)
          .OnDelete(DeleteBehavior.Cascade);
      builder.HasQueryFilter(e => !e.IsDeleted);
    }
  }
}