using System.ComponentModel.DataAnnotations;

namespace WatchStore.Application.DTOs
{
    public class BrandDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateBrandDto
    {
        [Required(ErrorMessage = "Brand name is required")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        [Url(ErrorMessage = "Invalid URL format")]
        public string? LogoUrl { get; set; }
    }

    public class UpdateBrandDto : CreateBrandDto
    {
        [Required]
        public int Id { get; set; }
    }
}
