namespace WatchStore.Domain.Entities
{
  public class Payment : BaseEntity
  {
    public int OrderId { get; set; }
    public string Provider { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "VND";
    public string? TransactionId { get; set; }
    public string Status { get; set; } = "Pending";
    public string? ProviderResponse { get; set; }
    public DateTime? PaidAt { get; set; }

    public virtual Order Order { get; set; } = null!;
  }
}