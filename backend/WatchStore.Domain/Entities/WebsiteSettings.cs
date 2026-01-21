namespace WatchStore.Domain.Entities
{
  public class WebsiteSettings : BaseEntity
  {
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // General, Branding, Layout, SEO, etc.
    public string DataType { get; set; } = "text"; // text, textarea, image, color, number, boolean, json
  }
}
