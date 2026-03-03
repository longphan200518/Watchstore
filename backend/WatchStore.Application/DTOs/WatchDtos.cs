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

        // Thông số máy
        public string CaseSize { get; set; } = string.Empty;
        public string Movement { get; set; } = string.Empty;
        public string? Functions { get; set; }

        // Kích thước
        public string? Thickness { get; set; }
        public string? BandWidth { get; set; }

        // Chất liệu
        public string? Crystal { get; set; }
        public string? CaseMaterial { get; set; }
        public string? BandMaterial { get; set; }

        // Khác
        public string WaterResistance { get; set; } = string.Empty;
        public string? Warranty { get; set; }

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

        // Thông số máy
        public string CaseSize { get; set; } = string.Empty;
        public string Movement { get; set; } = string.Empty;
        public string Functions { get; set; } = string.Empty;

        // Kích thước
        public string Thickness { get; set; } = string.Empty;
        public string BandWidth { get; set; } = string.Empty;

        // Chất liệu
        public string Crystal { get; set; } = string.Empty;
        public string CaseMaterial { get; set; } = string.Empty;
        public string BandMaterial { get; set; } = string.Empty;

        // Khác
        public string WaterResistance { get; set; } = string.Empty;
        public string Warranty { get; set; } = string.Empty;

        public WatchStatus Status { get; set; } = WatchStatus.Available;

        // Image URLs to be added to the watch
        public List<string>? ImageUrls { get; set; }
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

    /// <summary>
    /// Fluent Builder Pattern for CreateWatchDto
    /// </summary>
    public class CreateWatchDtoBuilder
    {
        private readonly CreateWatchDto _dto = new();

        public CreateWatchDtoBuilder WithName(string name)
        {
            _dto.Name = name;
            return this;
        }

        public CreateWatchDtoBuilder WithDescription(string? description)
        {
            _dto.Description = description;
            return this;
        }

        public CreateWatchDtoBuilder WithPrice(decimal price)
        {
            _dto.Price = price;
            return this;
        }

        public CreateWatchDtoBuilder WithStockQuantity(int quantity)
        {
            _dto.StockQuantity = quantity;
            return this;
        }

        public CreateWatchDtoBuilder WithBrand(int brandId)
        {
            _dto.BrandId = brandId;
            return this;
        }

        public CreateWatchDtoBuilder WithCaseSize(string caseSize)
        {
            _dto.CaseSize = caseSize;
            return this;
        }

        public CreateWatchDtoBuilder WithMovement(string movement)
        {
            _dto.Movement = movement;
            return this;
        }

        public CreateWatchDtoBuilder WithFunctions(string functions)
        {
            _dto.Functions = functions;
            return this;
        }

        public CreateWatchDtoBuilder WithThickness(string thickness)
        {
            _dto.Thickness = thickness;
            return this;
        }

        public CreateWatchDtoBuilder WithBandWidth(string bandWidth)
        {
            _dto.BandWidth = bandWidth;
            return this;
        }

        public CreateWatchDtoBuilder WithCrystal(string crystal)
        {
            _dto.Crystal = crystal;
            return this;
        }

        public CreateWatchDtoBuilder WithCaseMaterial(string caseMaterial)
        {
            _dto.CaseMaterial = caseMaterial;
            return this;
        }

        public CreateWatchDtoBuilder WithBandMaterial(string bandMaterial)
        {
            _dto.BandMaterial = bandMaterial;
            return this;
        }

        public CreateWatchDtoBuilder WithWaterResistance(string waterResistance)
        {
            _dto.WaterResistance = waterResistance;
            return this;
        }

        public CreateWatchDtoBuilder WithWarranty(string warranty)
        {
            _dto.Warranty = warranty;
            return this;
        }

        public CreateWatchDtoBuilder WithStatus(WatchStatus status)
        {
            _dto.Status = status;
            return this;
        }

        public CreateWatchDtoBuilder WithImageUrls(params string[] imageUrls)
        {
            _dto.ImageUrls = imageUrls.ToList();
            return this;
        }

        public CreateWatchDtoBuilder AddImageUrl(string imageUrl)
        {
            _dto.ImageUrls ??= new List<string>();
            _dto.ImageUrls.Add(imageUrl);
            return this;
        }

        public CreateWatchDto Build()
        {
            return _dto;
        }
    }
}
