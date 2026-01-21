using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
  [ApiController]
  [Route("api/website-settings")]
  public class WebsiteSettingsController : ControllerBase
  {
    private readonly IWebsiteSettingsService _settingsService;

    public WebsiteSettingsController(IWebsiteSettingsService settingsService)
    {
      _settingsService = settingsService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PublicWebsiteSettingsDto>), 200)]
    public async Task<IActionResult> GetPublicSettings()
    {
      try
      {
        var settings = await _settingsService.GetPublicSettingsAsync();
        return Ok(ApiResponse<PublicWebsiteSettingsDto>.SuccessResponse(settings));
      }
      catch (Exception ex)
      {
        return BadRequest(ApiResponse<PublicWebsiteSettingsDto>.ErrorResponse(ex.Message));
      }
    }
  }
}
