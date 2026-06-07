using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class PriceHistoryConfiguration : IEntityTypeConfiguration<PriceHistory>
  {
    public void Configure(EntityTypeBuilder<PriceHistory> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.OldPrice).HasColumnType("decimal(18,2)");
      builder.Property(e => e.NewPrice).HasColumnType("decimal(18,2)");
      builder.Property(e => e.Reason).HasMaxLength(500);
      builder.HasOne(e => e.Watch)
          .WithMany()
          .HasForeignKey(e => e.WatchId)
          .OnDelete(DeleteBehavior.Cascade);
      builder.HasOne(e => e.ChangedByUser)
          .WithMany()
          .HasForeignKey(e => e.ChangedBy)
          .OnDelete(DeleteBehavior.SetNull);
      builder.HasIndex(e => e.WatchId);
      builder.HasIndex(e => e.ChangedAt);
      builder.HasQueryFilter(e => !e.IsDeleted);
    }
  }
}