namespace WatchStore.Domain.Entities
{
  public class PriceHistory : BaseEntity
  {
    public int WatchId { get; set; }
    public decimal OldPrice { get; set; }
    public decimal NewPrice { get; set; }
    public string? Reason { get; set; }
    public int? ChangedBy { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public virtual Watch Watch { get; set; } = null!;
    public virtual User? ChangedByUser { get; set; }
  }
}