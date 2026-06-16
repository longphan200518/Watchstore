namespace WatchStore.Domain.Entities
{
    /// <summary>
    /// Lưu thông tin giao dịch thanh toán cho một đơn hàng.
    /// Status: pending, success, failed, refunded
    /// </summary>
    public class Payment : BaseEntity
    {
        public int OrderId { get; set; }
        public string Provider { get; set; } = string.Empty;        // VNPay, COD, Momo...
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "VND";               // max 10
        public string? TransactionId { get; set; }                  // Mã giao dịch từ cổng thanh toán (max 100)
        public string Status { get; set; } = "pending";             // pending | success | failed | refunded (max 30)
        public string? ProviderResponse { get; set; }               // JSON response từ cổng thanh toán
        public DateTime? PaidAt { get; set; }

        // Navigation properties
        public virtual Order Order { get; set; } = null!;
    }
}
