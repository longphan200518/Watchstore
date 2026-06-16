namespace WatchStore.Domain.Entities
{
    /// <summary>
    /// Lưu lịch sử thay đổi giá của sản phẩm.
    /// Dùng để audit trail và phân tích giá.
    /// </summary>
    public class PriceHistory : BaseEntity
    {
        public int WatchId { get; set; }
        public decimal OldPrice { get; set; }
        public decimal NewPrice { get; set; }
        public string? Reason { get; set; }     // Lý do thay đổi giá (max 500)
        public int? ChangedBy { get; set; }     // UserId người thay đổi
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Watch Watch { get; set; } = null!;
        public virtual User? ChangedByUser { get; set; }
    }
}
