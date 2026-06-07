using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class OrderConfiguration : IEntityTypeConfiguration<Order>
  {
    public void Configure(EntityTypeBuilder<Order> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
      builder.HasOne(e => e.User)
          .WithMany(u => u.Orders)
          .HasForeignKey(e => e.UserId)
          .OnDelete(DeleteBehavior.Restrict);
      builder.HasQueryFilter(e => !e.IsDeleted);
    }
  }
}