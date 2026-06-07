using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class InventoryTransactionConfiguration : IEntityTypeConfiguration<InventoryTransaction>
  {
    public void Configure(EntityTypeBuilder<InventoryTransaction> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.ChangeAmount);
      builder.Property(e => e.TransactionType).IsRequired().HasMaxLength(50);
      builder.Property(e => e.ReferenceType).HasMaxLength(50);
      builder.Property(e => e.Note).HasMaxLength(500);
      builder.HasOne(e => e.Watch)
          .WithMany()
          .HasForeignKey(e => e.WatchId)
          .OnDelete(DeleteBehavior.Cascade);
      builder.HasOne(e => e.CreatedByUser)
          .WithMany()
          .HasForeignKey(e => e.CreatedBy)
          .OnDelete(DeleteBehavior.SetNull);
      builder.HasIndex(e => e.WatchId);
      builder.HasIndex(e => e.CreatedAt);
      builder.HasQueryFilter(e => !e.IsDeleted);
    }
  }
}