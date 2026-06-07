using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class WatchConfiguration : IEntityTypeConfiguration<Watch>
  {
    public void Configure(EntityTypeBuilder<Watch> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.Name).IsRequired().HasMaxLength(300);
      builder.Property(e => e.Price).HasColumnType("decimal(18,2)");
      builder.HasOne(e => e.Brand)
          .WithMany(b => b.Watches)
          .HasForeignKey(e => e.BrandId)
          .OnDelete(DeleteBehavior.Restrict);
      builder.HasOne(e => e.Seller)
          .WithMany(u => u.Watches)
          .HasForeignKey(e => e.SellerId)
          .OnDelete(DeleteBehavior.SetNull);
      builder.HasQueryFilter(e => !e.IsDeleted);
    }
  }
}