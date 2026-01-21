namespace WatchStore.Application.DTOs
{
  public class CouponDto
  {
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DiscountType { get; set; } // 1=Percentage, 2=FixedAmount
    public string DiscountTypeDisplay => DiscountType == 1 ? "Phần trăm" : "Số tiền cố định";
    public decimal DiscountValue { get; set; }
    public decimal? MinimumOrderValue { get; set; }
    public decimal? MaximumDiscountAmount { get; set; }
    public int? MaxUsageCount { get; set; }
    public int? MaxUsagePerUser { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
    public int UsageCount { get; set; }
    public bool IsExpired => DateTime.UtcNow > EndDate;
    public bool IsAvailable => IsActive && !IsExpired && (MaxUsageCount == null || UsageCount < MaxUsageCount);
  }

  public class CreateCouponDto
  {
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MinimumOrderValue { get; set; }
    public decimal? MaximumDiscountAmount { get; set; }
    public int? MaxUsageCount { get; set; }
    public int? MaxUsagePerUser { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; } = true;
  }

  public class UpdateCouponDto
  {
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal DiscountValue { get; set; }
    public decimal? MinimumOrderValue { get; set; }
    public decimal? MaximumDiscountAmount { get; set; }
    public int? MaxUsageCount { get; set; }
    public int? MaxUsagePerUser { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
  }

  public class ValidateCouponDto
  {
    public string Code { get; set; } = string.Empty;
    public decimal OrderTotal { get; set; }
    public int? UserId { get; set; }
  }

  public class CouponValidationResult
  {
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; }
    public CouponDto? Coupon { get; set; }
  }
}
