using WatchStore.Domain.Enums;
namespace WatchStore.Domain.Entities
{
    public class Watch : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public int BrandId { get; set; }
        public WatchStatus Status { get; set; } = WatchStatus.Available;
        // Thông số máy
        public string CaseSize { get; set; } = string.Empty;
        public string Movement { get; set; } = string.Empty;
        public string Functions { get; set; } = string.Empty; // Chronograph / Date

        // Kích thước
        public string Thickness { get; set; } = string.Empty;
        public string BandWidth { get; set; } = string.Empty;

        // Chất liệu
        public string Crystal { get; set; } = string.Empty; // Sapphire
        public string CaseMaterial { get; set; } = string.Empty; // Thép không gỉ 316L
        public string BandMaterial { get; set; } = string.Empty; // Da / Thép

        // Khác
        public string WaterResistance { get; set; } = string.Empty;
        public string Warranty { get; set; } = string.Empty; // 24 tháng

        public int? SellerId { get; set; }
        // Navigation properties
        public virtual Brand Brand { get; set; } = null!;
        public virtual User? Seller { get; set; }
        public virtual ICollection<WatchImage> Images { get; set; } = new List<WatchImage>();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
