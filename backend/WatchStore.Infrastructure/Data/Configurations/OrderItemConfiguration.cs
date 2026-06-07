using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
  {
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.Price).HasColumnType("decimal(18,2)");
      builder.HasOne(e => e.Order)
          .WithMany(o => o.OrderItems)
          .HasForeignKey(e => e.OrderId)
          .OnDelete(DeleteBehavior.Cascade);
      builder.HasOne(e => e.Watch)
          .WithMany(w => w.OrderItems)
          .HasForeignKey(e => e.WatchId)
          .OnDelete(DeleteBehavior.Restrict);
      builder.HasQueryFilter(e => !e.IsDeleted);
    }
  }
}