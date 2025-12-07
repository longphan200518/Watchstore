namespace WatchStore.Domain.Entities
{
    public class WatchImage : BaseEntity
    {
        public int WatchId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; } = false;
        // Navigation properties
        public virtual Watch Watch { get; set; } = null!;
    }
}
