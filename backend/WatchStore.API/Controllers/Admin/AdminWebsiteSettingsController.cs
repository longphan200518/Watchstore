using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers.Admin
{
  [ApiController]
  [Route("api/admin/website-settings")]
  [Authorize(Roles = "Admin")]
  [ApiExplorerSettings(GroupName = "admin")]
  public class AdminWebsiteSettingsController : ControllerBase
  {
    private readonly IWebsiteSettingsService _settingsService;

    public AdminWebsiteSettingsController(IWebsiteSettingsService settingsService)
    {
      _settingsService = settingsService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<WebsiteSettingsDto>>), 200)]
    public async Task<IActionResult> GetAll()
    {
      try
      {
        var settings = await _settingsService.GetAllSettingsAsync();
        return Ok(ApiResponse<List<WebsiteSettingsDto>>.SuccessResponse(settings));
      }
      catch (Exception ex)
      {
        return BadRequest(ApiResponse<List<WebsiteSettingsDto>>.ErrorResponse(ex.Message));
      }
    }

    [HttpGet("by-category")]
    [ProducesResponseType(typeof(ApiResponse<List<WebsiteSettingsByCategoryDto>>), 200)]
    public async Task<IActionResult> GetAllByCategory()
    {
      try
      {
        var settings = await _settingsService.GetAllSettingsByCategoryAsync();
        return Ok(ApiResponse<List<WebsiteSettingsByCategoryDto>>.SuccessResponse(settings));
      }
      catch (Exception ex)
      {
        return BadRequest(ApiResponse<List<WebsiteSettingsByCategoryDto>>.ErrorResponse(ex.Message));
      }
    }

    [HttpGet("category/{category}")]
    [ProducesResponseType(typeof(ApiResponse<List<WebsiteSettingsDto>>), 200)]
    public async Task<IActionResult> GetByCategory(string category)
    {
      try
      {
        var settings = await _settingsService.GetSettingsByCategoryAsync(category);
        return Ok(ApiResponse<List<WebsiteSettingsDto>>.SuccessResponse(settings));
      }
      catch (Exception ex)
      {
        return BadRequest(ApiResponse<List<WebsiteSettingsDto>>.ErrorResponse(ex.Message));
      }
    }

    [HttpGet("{key}")]
    [ProducesResponseType(typeof(ApiResponse<WebsiteSettingsDto>), 200)]
    public async Task<IActionResult> GetByKey(string key)
    {
      try
      {
        var setting = await _settingsService.GetSettingByKeyAsync(key);
        if (setting == null)
          return NotFound(ApiResponse<WebsiteSettingsDto>.ErrorResponse("Setting not found"));

        return Ok(ApiResponse<WebsiteSettingsDto>.SuccessResponse(setting));
      }
      catch (Exception ex)
      {
        return BadRequest(ApiResponse<WebsiteSettingsDto>.ErrorResponse(ex.Message));
      }
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<WebsiteSettingsDto>), 201)]
    public async Task<IActionResult> Create([FromBody] CreateWebsiteSettingsDto dto)
    {
      try
      {
        var setting = await _settingsService.CreateSettingAsync(dto);
        return CreatedAtAction(nameof(GetByKey), new { key = setting.Key },
            ApiResponse<WebsiteSettingsDto>.SuccessResponse(setting));
      }
      catch (Exception ex)
      {
        return BadRequest(ApiResponse<WebsiteSettingsDto>.ErrorResponse(ex.Message));
      }
    }

    [HttpPut("{key}")]
    [ProducesResponseType(typeof(ApiResponse<WebsiteSettingsDto>), 200)]
    public async Task<IActionResult> Update(string key, [FromBody] UpdateWebsiteSettingsDto dto)
    {
      try
      {
        var setting = await _settingsService.UpdateSettingAsync(key, dto);
        return Ok(ApiResponse<WebsiteSettingsDto>.SuccessResponse(setting));
      }
      catch (Exception ex)
      {
        return BadRequest(ApiResponse<WebsiteSettingsDto>.ErrorResponse(ex.Message));
      }
    }

    [HttpPut("bulk")]
    [ProducesResponseType(typeof(ApiResponse<string>), 200)]
    public async Task<IActionResult> BulkUpdate([FromBody] Dictionary<string, string> settings)
    {
      try
      {
        await _settingsService.BulkUpdateSettingsAsync(settings);
        return Ok(ApiResponse<string>.SuccessResponse("Settings updated successfully"));
      }
      catch (Exception ex)
      {
        return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
      }
    }

    [HttpDelete("{key}")]
    [ProducesResponseType(typeof(ApiResponse<string>), 200)]
    public async Task<IActionResult> Delete(string key)
    {
      try
      {
        var success = await _settingsService.DeleteSettingAsync(key);
        if (!success)
          return NotFound(ApiResponse<string>.ErrorResponse("Setting not found"));

        return Ok(ApiResponse<string>.SuccessResponse("Setting deleted successfully"));
      }
      catch (Exception ex)
      {
        return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
      }
    }
  }
}
