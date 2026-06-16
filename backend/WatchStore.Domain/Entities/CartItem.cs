namespace WatchStore.Domain.Entities
{
    /// <summary>
    /// Một dòng sản phẩm trong giỏ hàng.
    /// UnitPrice lưu giá tại thời điểm thêm vào giỏ.
    /// </summary>
    public class CartItem : BaseEntity
    {
        public int CartId { get; set; }
        public int WatchId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; } // Giá tại thời điểm thêm vào giỏ

        // Navigation properties
        public virtual Cart Cart { get; set; } = null!;
        public virtual Watch Watch { get; set; } = null!;
    }
}
