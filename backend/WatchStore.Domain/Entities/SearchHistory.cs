namespace WatchStore.Domain.Entities
{
    public class SearchHistory : BaseEntity
    {
        public int UserId { get; set; }
        public string SearchTerm { get; set; } = string.Empty;

        public virtual User User { get; set; } = null!;
    }
}
