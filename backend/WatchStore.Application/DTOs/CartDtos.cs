using System.ComponentModel.DataAnnotations;

namespace WatchStore.Application.DTOs
{
    // DTO trả về cho client
    public class CartDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string? SessionId { get; set; }
        public List<CartItemDto> Items { get; set; } = new();
        public decimal TotalPrice => Items.Sum(i => i.UnitPrice * i.Quantity);
        public int TotalItems => Items.Sum(i => i.Quantity);
    }

    public class CartItemDto
    {
        public int Id { get; set; }
        public int WatchId { get; set; }
        public string WatchName { get; set; } = string.Empty;
        public string? WatchImageUrl { get; set; }
        public string? BrandName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal => UnitPrice * Quantity;
        public int StockQuantity { get; set; }  // Tồn kho hiện tại để validate
    }

    // DTO thêm sản phẩm vào giỏ
    public class AddToCartDto
    {
        [Required(ErrorMessage = "WatchId là bắt buộc")]
        public int WatchId { get; set; }

        [Required(ErrorMessage = "Số lượng là bắt buộc")]
        [Range(1, 100, ErrorMessage = "Số lượng phải từ 1 đến 100")]
        public int Quantity { get; set; } = 1;
    }

    // DTO cập nhật số lượng
    public class UpdateCartItemDto
    {
        [Required(ErrorMessage = "Số lượng là bắt buộc")]
        [Range(1, 100, ErrorMessage = "Số lượng phải từ 1 đến 100")]
        public int Quantity { get; set; }
    }

    // DTO merge giỏ hàng (khi user đăng nhập)
    public class MergeCartDto
    {
        [Required(ErrorMessage = "SessionId là bắt buộc")]
        public string SessionId { get; set; } = string.Empty;
    }
}
