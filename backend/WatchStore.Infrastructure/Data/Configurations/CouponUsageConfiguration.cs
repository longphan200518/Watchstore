using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class CouponUsageConfiguration : IEntityTypeConfiguration<CouponUsage>
  {
    public void Configure(EntityTypeBuilder<CouponUsage> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.DiscountAmount).HasColumnType("decimal(18,2)");
      builder.HasOne(e => e.Coupon)
          .WithMany(c => c.CouponUsages)
          .HasForeignKey(e => e.CouponId)
          .OnDelete(DeleteBehavior.Restrict);
      builder.HasOne(e => e.User)
          .WithMany()
          .HasForeignKey(e => e.UserId)
          .OnDelete(DeleteBehavior.Restrict);
      builder.HasOne(e => e.Order)
          .WithMany()
          .HasForeignKey(e => e.OrderId)
          .OnDelete(DeleteBehavior.Restrict);
      builder.HasIndex(e => new { e.CouponId, e.UserId });
      builder.HasQueryFilter(e => !e.IsDeleted);
    }
  }
}