using System.ComponentModel.DataAnnotations;
using WatchStore.Domain.Enums;

namespace WatchStore.Application.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }
        public string? ShippingAddress { get; set; }
        public string? Notes { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }

    public class OrderItemDto
    {
        public int Id { get; set; }
        public int WatchId { get; set; }
        public string WatchName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Subtotal => Quantity * Price;
    }

    public class CreateOrderDto
    {
        [Required(ErrorMessage = "Shipping address is required")]
        [MaxLength(500, ErrorMessage = "Address cannot exceed 500 characters")]
        public string ShippingAddress { get; set; } = string.Empty;

        [MaxLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
        public string? Notes { get; set; }

        [Required(ErrorMessage = "Order items are required")]
        [MinLength(1, ErrorMessage = "Order must have at least one item")]
        public List<CreateOrderItemDto> OrderItems { get; set; } = new();
    }

    public class CreateOrderItemDto
    {
        [Required(ErrorMessage = "Watch ID is required")]
        public int WatchId { get; set; }

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }
    }

    public class UpdateOrderStatusDto
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        public OrderStatus Status { get; set; }
    }
}
