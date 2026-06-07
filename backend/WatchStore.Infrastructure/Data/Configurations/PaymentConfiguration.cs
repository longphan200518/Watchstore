using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
  {
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.Provider).IsRequired().HasMaxLength(50);
      builder.Property(e => e.Amount).HasColumnType("decimal(18,2)");
      builder.Property(e => e.Currency).HasMaxLength(10);
      builder.Property(e => e.TransactionId).HasMaxLength(100);
      builder.Property(e => e.Status).HasMaxLength(30);
      builder.Property(e => e.ProviderResponse).HasColumnType("nvarchar(max)");
      builder.HasOne(e => e.Order)
          .WithMany()
          .HasForeignKey(e => e.OrderId)
          .OnDelete(DeleteBehavior.Cascade);
      builder.HasIndex(e => e.TransactionId).IsUnique(false);
      builder.HasIndex(e => e.OrderId);
      builder.HasQueryFilter(e => !e.IsDeleted);
    }
  }
}