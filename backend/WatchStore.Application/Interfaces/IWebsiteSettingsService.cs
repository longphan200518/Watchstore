using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
  public interface IWebsiteSettingsService
  {
    Task<List<WebsiteSettingsDto>> GetAllSettingsAsync();
    Task<List<WebsiteSettingsByCategoryDto>> GetAllSettingsByCategoryAsync();
    Task<WebsiteSettingsDto?> GetSettingByKeyAsync(string key);
    Task<List<WebsiteSettingsDto>> GetSettingsByCategoryAsync(string category);
    Task<WebsiteSettingsDto> CreateSettingAsync(CreateWebsiteSettingsDto dto);
    Task<WebsiteSettingsDto> UpdateSettingAsync(string key, UpdateWebsiteSettingsDto dto);
    Task<bool> DeleteSettingAsync(string key);
    Task<PublicWebsiteSettingsDto> GetPublicSettingsAsync();
    Task BulkUpdateSettingsAsync(Dictionary<string, string> settings);
  }
}
