namespace WatchStore.Application.DTOs
{
    public class WishlistItemDto
    {
        public int WatchId { get; set; }
        public string WatchName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public string BrandName { get; set; } = string.Empty;
        public DateTime AddedAt { get; set; }
    }
}
