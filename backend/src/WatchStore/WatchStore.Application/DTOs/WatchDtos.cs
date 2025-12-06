using System.ComponentModel.DataAnnotations;
using WatchStore.Domain.Enums;

namespace WatchStore.Application.DTOs
{
    public class WatchDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public WatchStatus Status { get; set; }
        public int BrandId { get; set; }
        public string BrandName { get; set; } = string.Empty;
        public int? SellerId { get; set; }
        public string? SellerName { get; set; }
        public List<WatchImageDto> Images { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }

    public class WatchImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
    }

    public class CreateWatchDto
    {
        [Required(ErrorMessage = "Watch name is required")]
        [MaxLength(300, ErrorMessage = "Name cannot exceed 300 characters")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Stock quantity is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity must be non-negative")]
        public int StockQuantity { get; set; }

        [Required(ErrorMessage = "Brand is required")]
        public int BrandId { get; set; }

        public WatchStatus Status { get; set; } = WatchStatus.Available;
    }

    public class UpdateWatchDto : CreateWatchDto
    {
        [Required]
        public int Id { get; set; }
    }

    public class WatchFilterDto
    {
        public string? SearchTerm { get; set; }
        public int? BrandId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public WatchStatus? Status { get; set; }
        public string? SortBy { get; set; } = "createdAt"; // name, price, createdAt
        public bool IsDescending { get; set; } = true;
    }
}
