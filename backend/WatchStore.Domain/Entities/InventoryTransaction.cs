namespace WatchStore.Domain.Entities
{
    /// <summary>
    /// Ghi lại mọi thay đổi tồn kho (nhập hàng, xuất hàng, hủy đơn...).
    /// TransactionType: import | sale | cancel | adjustment
    /// </summary>
    public class InventoryTransaction : BaseEntity
    {
        public int WatchId { get; set; }
        public int ChangeAmount { get; set; }                        // Dương = nhập, Âm = xuất
        public string TransactionType { get; set; } = string.Empty; // max 50
        public string? ReferenceType { get; set; }                   // "Order", "Manual"... (max 50)
        public int? ReferenceId { get; set; }                        // OrderId hoặc id tham chiếu khác
        public string? Note { get; set; }                            // max 500
        public int? CreatedBy { get; set; }                          // UserId người thực hiện

        // Navigation properties
        public virtual Watch Watch { get; set; } = null!;
        public virtual User? CreatedByUser { get; set; }
    }
}
