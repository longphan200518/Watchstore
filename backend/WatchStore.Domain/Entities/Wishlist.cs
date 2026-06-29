namespace WatchStore.Domain.Entities
{
    public class Wishlist : BaseEntity
    {
        public int UserId { get; set; }
        public int WatchId { get; set; }

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Watch Watch { get; set; } = null!;
    }
}
