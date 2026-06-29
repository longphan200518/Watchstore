namespace WatchStore.Domain.Entities
{
    public class Notification : BaseEntity
    {
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public string Type { get; set; } = "System"; // VD: "Order", "Promotion", "System"
        public string? ReferenceUrl { get; set; } // Link bấm vào khi xem thông báo

        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
}
