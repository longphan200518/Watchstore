namespace WatchStore.Domain.Entities
{
  public class InventoryTransaction : BaseEntity
  {
    public int WatchId { get; set; }
    public int ChangeAmount { get; set; }
    public string TransactionType { get; set; } = string.Empty;
    public string? ReferenceType { get; set; }
    public int? ReferenceId { get; set; }
    public string? Note { get; set; }
    public int? CreatedBy { get; set; }

    public virtual Watch Watch { get; set; } = null!;
    public virtual User? CreatedByUser { get; set; }
  }
}