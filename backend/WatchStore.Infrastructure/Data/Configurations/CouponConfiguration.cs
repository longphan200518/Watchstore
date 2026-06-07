using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class CouponConfiguration : IEntityTypeConfiguration<Coupon>
  {
    public void Configure(EntityTypeBuilder<Coupon> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.Code).IsRequired().HasMaxLength(50);
      builder.Property(e => e.Description).HasMaxLength(500);
      builder.Property(e => e.DiscountValue).HasColumnType("decimal(18,2)");
      builder.Property(e => e.MinimumOrderValue).HasColumnType("decimal(18,2)");
      builder.Property(e => e.MaximumDiscountAmount).HasColumnType("decimal(18,2)");
      builder.HasIndex(e => e.Code).IsUnique();
      builder.HasIndex(e => e.IsActive);
      builder.HasQueryFilter(e => !e.IsDeleted);
    }
  }
}