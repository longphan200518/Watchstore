namespace WatchStore.Domain.Entities
{
    public class Brand : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public string? Country { get; set; }
        // Navigation properties
        public virtual ICollection<Watch> Watches { get; set; } = new List<Watch>();
    }
}
