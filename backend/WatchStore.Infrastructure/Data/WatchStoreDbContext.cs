using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data
{
    public class WatchStoreDbContext : IdentityDbContext<User, Role, int>
    {
        public WatchStoreDbContext(DbContextOptions<WatchStoreDbContext> options) : base(options)
        {
        }

        public DbSet<Brand> Brands { get; set; }
        public DbSet<Watch> Watches { get; set; }
        public DbSet<WatchImage> WatchImages { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<OtpVerification> OtpVerifications { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<WebsiteSettings> WebsiteSettings { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<CouponUsage> CouponUsages { get; set; }

        // Nhiệm vụ 1 – Entities mới theo CSDL mới
        public DbSet<Category> Categories { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<InventoryTransaction> InventoryTransactions { get; set; }
        public DbSet<PriceHistory> PriceHistories { get; set; }
        public DbSet<UserAddress> UserAddresses { get; set; }
        public DbSet<SearchHistory> SearchHistories { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Brand configuration
            builder.Entity<Brand>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // Watch configuration
            builder.Entity<Watch>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(300);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Brand)
                      .WithMany(b => b.Watches)
                      .HasForeignKey(e => e.BrandId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Watches)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Seller)
                      .WithMany(u => u.Watches)
                      .HasForeignKey(e => e.SellerId)
                      .OnDelete(DeleteBehavior.SetNull);
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // Category configuration
            builder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // WatchImage configuration
            builder.Entity<WatchImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Watch)
                      .WithMany(w => w.Images)
                      .HasForeignKey(e => e.WatchId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // Order configuration
            builder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Orders)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // OrderItem configuration
            builder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Order)
                      .WithMany(o => o.OrderItems)
                      .HasForeignKey(e => e.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Watch)
                      .WithMany(w => w.OrderItems)
                      .HasForeignKey(e => e.WatchId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // OtpVerification configuration
            builder.Entity<OtpVerification>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Otp).IsRequired().HasMaxLength(10);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Email);
                entity.HasIndex(e => new { e.Email, e.Type });
            });

            // RefreshToken configuration
            builder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Token).IsRequired().HasMaxLength(512);
                entity.HasIndex(e => e.Token).IsUnique();
                entity.HasIndex(e => e.UserId);
            });

            // Review configuration
            builder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Rating).IsRequired();
                entity.HasOne(e => e.Watch)
                      .WithMany()
                      .HasForeignKey(e => e.WatchId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasQueryFilter(e => !e.IsDeleted);
                entity.HasIndex(e => e.WatchId);
                entity.HasIndex(e => e.UserId);
            });

            // WebsiteSettings configuration
            builder.Entity<WebsiteSettings>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Key).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Category).HasMaxLength(50);
                entity.Property(e => e.DataType).HasMaxLength(20);
                entity.HasIndex(e => e.Key).IsUnique();
                entity.HasIndex(e => e.Category);
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // Coupon configuration
            builder.Entity<Coupon>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.DiscountValue).HasColumnType("decimal(18,2)");
                entity.Property(e => e.MinimumOrderValue).HasColumnType("decimal(18,2)");
                entity.Property(e => e.MaximumDiscountAmount).HasColumnType("decimal(18,2)");
                entity.HasIndex(e => e.Code).IsUnique();
                entity.HasIndex(e => e.IsActive);
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // CouponUsage configuration
            builder.Entity<CouponUsage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.DiscountAmount).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Coupon)
                      .WithMany(c => c.CouponUsages)
                      .HasForeignKey(e => e.CouponId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Order)
                      .WithMany()
                      .HasForeignKey(e => e.OrderId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasIndex(e => new { e.CouponId, e.UserId });
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // Cart configuration
            builder.Entity<Cart>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SessionId).HasMaxLength(100);
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Carts)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasQueryFilter(e => !e.IsDeleted);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.SessionId);
            });

            // CartItem configuration
            builder.Entity<CartItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Cart)
                      .WithMany(c => c.CartItems)
                      .HasForeignKey(e => e.CartId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Watch)
                      .WithMany(w => w.CartItems)
                      .HasForeignKey(e => e.WatchId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasQueryFilter(e => !e.IsDeleted);
                entity.HasIndex(e => new { e.CartId, e.WatchId }).IsUnique();
            });

            // Payment configuration
            builder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Provider).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Currency).IsRequired().HasMaxLength(10);
                entity.Property(e => e.TransactionId).HasMaxLength(100);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(30);
                entity.HasOne(e => e.Order)
                      .WithMany(o => o.Payments)
                      .HasForeignKey(e => e.OrderId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasQueryFilter(e => !e.IsDeleted);
                entity.HasIndex(e => e.OrderId);
                entity.HasIndex(e => e.TransactionId);
            });

            // InventoryTransaction configuration
            builder.Entity<InventoryTransaction>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TransactionType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.ReferenceType).HasMaxLength(50);
                entity.Property(e => e.Note).HasMaxLength(500);
                entity.HasOne(e => e.Watch)
                      .WithMany(w => w.InventoryTransactions)
                      .HasForeignKey(e => e.WatchId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.CreatedByUser)
                      .WithMany()
                      .HasForeignKey(e => e.CreatedBy)
                      .OnDelete(DeleteBehavior.SetNull);
                entity.HasQueryFilter(e => !e.IsDeleted);
                entity.HasIndex(e => e.WatchId);
            });

            // PriceHistory configuration
            builder.Entity<PriceHistory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.OldPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.NewPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Reason).HasMaxLength(500);
                entity.HasOne(e => e.Watch)
                      .WithMany(w => w.PriceHistories)
                      .HasForeignKey(e => e.WatchId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.ChangedByUser)
                      .WithMany()
                      .HasForeignKey(e => e.ChangedBy)
                      .OnDelete(DeleteBehavior.SetNull);
                entity.HasQueryFilter(e => !e.IsDeleted);
                entity.HasIndex(e => e.WatchId);
            });

            // Wishlist configuration
            builder.Entity<Wishlist>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Watch)
                      .WithMany()
                      .HasForeignKey(e => e.WatchId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(e => new { e.UserId, e.WatchId }).IsUnique();
                entity.HasIndex(e => e.UserId);
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // Notification configuration
            builder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Message).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.Type).HasMaxLength(50);
                entity.Property(e => e.ReferenceUrl).HasMaxLength(500);
                
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Notifications)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
