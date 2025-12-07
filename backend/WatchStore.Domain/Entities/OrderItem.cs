namespace WatchStore.Domain.Entities
{
    public class OrderItem : BaseEntity
    {
        public int OrderId { get; set; }
        public int WatchId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        // Navigation properties
        public virtual Order Order { get; set; } = null!;
        public virtual Watch Watch { get; set; } = null!;
    }
}
