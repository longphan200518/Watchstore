using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class ReviewConfiguration : IEntityTypeConfiguration<Review>
  {
    public void Configure(EntityTypeBuilder<Review> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.Title).IsRequired().HasMaxLength(200);
      builder.Property(e => e.Content).IsRequired().HasMaxLength(2000);
      builder.Property(e => e.Rating).IsRequired();
      builder.HasOne(e => e.Watch)
          .WithMany()
          .HasForeignKey(e => e.WatchId)
          .OnDelete(DeleteBehavior.Cascade);
      builder.HasOne(e => e.User)
          .WithMany()
          .HasForeignKey(e => e.UserId)
          .OnDelete(DeleteBehavior.Cascade);
      builder.HasQueryFilter(e => !e.IsDeleted);
      builder.HasIndex(e => e.WatchId);
      builder.HasIndex(e => e.UserId);
    }
  }
}