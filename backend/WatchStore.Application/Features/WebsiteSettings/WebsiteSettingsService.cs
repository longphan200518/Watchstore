using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.WebsiteSettings
{
  public class WebsiteSettingsService : IWebsiteSettingsService
  {
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Domain.Entities.WebsiteSettings> _settingsRepository;

    public WebsiteSettingsService(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
      _settingsRepository = _unitOfWork.GetRepository<Domain.Entities.WebsiteSettings>();
    }

    public async Task<List<WebsiteSettingsDto>> GetAllSettingsAsync()
    {
      var settings = await _settingsRepository.GetAllAsync();
      return settings.Select(s => MapToDto(s)).OrderBy(s => s.Category).ThenBy(s => s.Key).ToList();
    }

    public async Task<List<WebsiteSettingsByCategoryDto>> GetAllSettingsByCategoryAsync()
    {
      var settings = await _settingsRepository.GetAllAsync();
      var grouped = settings
          .GroupBy(s => s.Category)
          .Select(g => new WebsiteSettingsByCategoryDto
          {
            Category = g.Key,
            Settings = g.Select(s => MapToDto(s)).OrderBy(s => s.Key).ToList()
          })
          .OrderBy(g => g.Category)
          .ToList();

      return grouped;
    }

    public async Task<WebsiteSettingsDto?> GetSettingByKeyAsync(string key)
    {
      var settings = await _settingsRepository.FindAsync(s => s.Key == key);
      var setting = settings.FirstOrDefault();
      return setting != null ? MapToDto(setting) : null;
    }

    public async Task<List<WebsiteSettingsDto>> GetSettingsByCategoryAsync(string category)
    {
      var settings = await _settingsRepository.FindAsync(s => s.Category == category);
      return settings.Select(s => MapToDto(s)).OrderBy(s => s.Key).ToList();
    }

    public async Task<WebsiteSettingsDto> CreateSettingAsync(CreateWebsiteSettingsDto dto)
    {
      // Kiểm tra key đã tồn tại chưa
      var existing = await _settingsRepository.FindAsync(s => s.Key == dto.Key);
      if (existing.Any())
        throw new Exception($"Setting with key '{dto.Key}' already exists");

      var setting = new Domain.Entities.WebsiteSettings
      {
        Key = dto.Key,
        Value = dto.Value,
        Description = dto.Description,
        Category = dto.Category,
        DataType = dto.DataType
      };

      await _settingsRepository.AddAsync(setting);
      await _unitOfWork.SaveChangesAsync();

      return MapToDto(setting);
    }

    public async Task<WebsiteSettingsDto> UpdateSettingAsync(string key, UpdateWebsiteSettingsDto dto)
    {
      var settings = await _settingsRepository.FindAsync(s => s.Key == key);
      var setting = settings.FirstOrDefault();

      if (setting == null)
        throw new Exception($"Setting with key '{key}' not found");

      setting.Value = dto.Value;
      if (dto.Description != null)
        setting.Description = dto.Description;

      await _settingsRepository.UpdateAsync(setting);
      await _unitOfWork.SaveChangesAsync();

      return MapToDto(setting);
    }

    public async Task<bool> DeleteSettingAsync(string key)
    {
      var settings = await _settingsRepository.FindAsync(s => s.Key == key);
      var setting = settings.FirstOrDefault();

      if (setting == null)
        return false;

      await _settingsRepository.DeleteAsync(setting);
      await _unitOfWork.SaveChangesAsync();

      return true;
    }

    public async Task<PublicWebsiteSettingsDto> GetPublicSettingsAsync()
    {
      var settings = await _settingsRepository.GetAllAsync();
      var dictionary = settings.ToDictionary(s => s.Key, s => s.Value);

      return new PublicWebsiteSettingsDto
      {
        Settings = dictionary
      };
    }

    public async Task BulkUpdateSettingsAsync(Dictionary<string, string> settings)
    {
      foreach (var kvp in settings)
      {
        var settingList = await _settingsRepository.FindAsync(s => s.Key == kvp.Key);
        var setting = settingList.FirstOrDefault();

        if (setting != null)
        {
          setting.Value = kvp.Value;
          await _settingsRepository.UpdateAsync(setting);
        }
      }

      await _unitOfWork.SaveChangesAsync();
    }

    private WebsiteSettingsDto MapToDto(Domain.Entities.WebsiteSettings setting)
    {
      return new WebsiteSettingsDto
      {
        Id = setting.Id,
        Key = setting.Key,
        Value = setting.Value,
        Description = setting.Description,
        Category = setting.Category,
        DataType = setting.DataType,
        CreatedAt = setting.CreatedAt,
        UpdatedAt = setting.UpdatedAt
      };
    }
  }
}
