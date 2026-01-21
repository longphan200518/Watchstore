namespace WatchStore.Application.DTOs
{
  public class WebsiteSettingsDto
  {
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string DataType { get; set; } = "text";
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
  }

  public class CreateWebsiteSettingsDto
  {
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string DataType { get; set; } = "text";
  }

  public class UpdateWebsiteSettingsDto
  {
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
  }

  public class WebsiteSettingsByCategoryDto
  {
    public string Category { get; set; } = string.Empty;
    public List<WebsiteSettingsDto> Settings { get; set; } = new();
  }

  // DTO để trả về cho user app (chỉ có key và value)
  public class PublicWebsiteSettingsDto
  {
    public Dictionary<string, string> Settings { get; set; } = new();
  }
}
