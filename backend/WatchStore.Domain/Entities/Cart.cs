namespace WatchStore.Domain.Entities
{
    /// <summary>
    /// Đại diện cho giỏ hàng của người dùng.
    /// UserId = null → giỏ hàng khách vãng lai (dùng SessionId).
    /// UserId != null → giỏ hàng của người dùng đã đăng nhập.
    /// </summary>
    public class Cart : BaseEntity
    {
        public int? UserId { get; set; }
        public string? SessionId { get; set; } // max 100, dùng khi chưa đăng nhập

        // Navigation properties
        public virtual User? User { get; set; }
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
