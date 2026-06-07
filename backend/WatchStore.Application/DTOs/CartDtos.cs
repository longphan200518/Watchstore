using System.ComponentModel.DataAnnotations;

namespace WatchStore.Application.DTOs
{
  public class CartDto
  {
    public int? Id { get; set; }
    public int? UserId { get; set; }
    public string? SessionId { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalAmount => Items.Sum(item => item.Subtotal);
  }

  public class CartItemDto
  {
    public int WatchId { get; set; }
    public string WatchName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal => UnitPrice * Quantity;
  }

  public class AddCartItemDto
  {
    [Required]
    public int WatchId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; } = 1;
  }

  public class UpdateCartItemDto
  {
    [Required]
    public int WatchId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
  }
}