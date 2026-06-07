using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WatchStore.Domain.Entities;

namespace WatchStore.Infrastructure.Data.Configurations
{
  public class OtpVerificationConfiguration : IEntityTypeConfiguration<OtpVerification>
  {
    public void Configure(EntityTypeBuilder<OtpVerification> builder)
    {
      builder.HasKey(e => e.Id);
      builder.Property(e => e.Email).IsRequired().HasMaxLength(255);
      builder.Property(e => e.Otp).IsRequired().HasMaxLength(10);
      builder.Property(e => e.Type).IsRequired().HasMaxLength(50);
      builder.HasIndex(e => e.Email);
      builder.HasIndex(e => new { e.Email, e.Type });
    }
  }
}