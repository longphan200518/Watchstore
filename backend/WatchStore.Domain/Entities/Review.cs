namespace WatchStore.Domain.Entities
{
  public class Review : BaseEntity
  {
    public int WatchId { get; set; }
    public virtual Watch Watch { get; set; } = null!;

    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public int Rating { get; set; } // 1-5 stars
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsVerified { get; set; } = false; // User bought this product
    public int HelpfulCount { get; set; } = 0;
  }
}
