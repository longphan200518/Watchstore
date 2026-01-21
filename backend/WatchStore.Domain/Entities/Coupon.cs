using WatchStore.Domain.Entities;

namespace WatchStore.Domain.Entities
{
  public class Coupon : BaseEntity
  {
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Discount type: 1=Percentage, 2=FixedAmount
    public int DiscountType { get; set; }
    public decimal DiscountValue { get; set; }

    // Conditions
    public decimal? MinimumOrderValue { get; set; }
    public decimal? MaximumDiscountAmount { get; set; }
    public int? MaxUsageCount { get; set; }
    public int? MaxUsagePerUser { get; set; }

    // Validity
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    // Status
    public bool IsActive { get; set; }

    // Usage tracking
    public int UsageCount { get; set; }

    // Navigation
    public ICollection<CouponUsage> CouponUsages { get; set; } = new List<CouponUsage>();
  }

  public class CouponUsage : BaseEntity
  {
    public int CouponId { get; set; }
    public Coupon Coupon { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public decimal DiscountAmount { get; set; }
    public DateTime UsedAt { get; set; }
  }
}
