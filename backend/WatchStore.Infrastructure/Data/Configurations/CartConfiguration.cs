using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
    public class CartConfiguration : IEntityTypeConfiguration<Cart>
    {
        public void Configure(EntityTypeBuilder<Cart> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.SessionId).HasMaxLength(100);
            builder.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);
            builder.HasIndex(e => e.UserId).IsUnique(false);
            builder.HasIndex(e => e.SessionId);
            builder.HasQueryFilter(e => !e.IsDeleted);
        }
    }

    public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
    {
        public void Configure(EntityTypeBuilder<CartItem> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");
            builder.HasOne(e => e.Cart)
                .WithMany(c => c.CartItems)
                .HasForeignKey(e => e.CartId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(e => e.Watch)
                .WithMany()
                .HasForeignKey(e => e.WatchId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasIndex(e => new { e.CartId, e.WatchId }).IsUnique();
            builder.HasQueryFilter(e => !e.IsDeleted);
        }
    }
}