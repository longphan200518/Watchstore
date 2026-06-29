namespace WatchStore.Application.DTOs
{
    public class SearchHistoryDto
    {
        public int Id { get; set; }
        public string SearchTerm { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
