using System.ComponentModel.DataAnnotations;

namespace WatchStore.Application.DTOs
{
    public class InventoryItemDto
    {
        public int WatchId { get; set; }
        public string WatchName { get; set; } = string.Empty;
        public string BrandName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }

    public class InventoryTransactionDto
    {
        public int Id { get; set; }
        public int WatchId { get; set; }
        public string WatchName { get; set; } = string.Empty;
        public int ChangeAmount { get; set; }
        public string TransactionType { get; set; } = string.Empty;
        public string? ReferenceType { get; set; }
        public int? ReferenceId { get; set; }
        public string? Note { get; set; }
        public string? CreatedByName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AdjustStockDto
    {
        [Required]
        public int WatchId { get; set; }

        [Required]
        [Range(-10000, 10000, ErrorMessage = "ChangeAmount must be between -10000 and 10000")]
        public int ChangeAmount { get; set; }

        [Required]
        [MaxLength(50)]
        public string TransactionType { get; set; } = "adjustment"; // import | adjustment | manual

        [MaxLength(500)]
        public string? Note { get; set; }
    }
}
