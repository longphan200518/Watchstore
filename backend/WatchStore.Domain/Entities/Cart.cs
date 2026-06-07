namespace WatchStore.Domain.Entities
{
  public class Cart : BaseEntity
  {
    public int? UserId { get; set; }
    public string? SessionId { get; set; }

    public virtual User? User { get; set; }
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
  }

  public class CartItem : BaseEntity
  {
    public int CartId { get; set; }
    public int WatchId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    public virtual Cart Cart { get; set; } = null!;
    public virtual Watch Watch { get; set; } = null!;
  }
}