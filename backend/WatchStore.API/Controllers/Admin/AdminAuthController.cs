using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers.Admin
{
  [ApiController]
  [Route("api/admin/auth")]
  [ApiExplorerSettings(GroupName = "admin")]
  public class AdminAuthController : ControllerBase
  {
    private readonly IAuthService _authService;

    public AdminAuthController(IAuthService authService)
    {
      _authService = authService;
    }

    /// <summary>
    /// Admin login (email/password). Requires user to have Admin role.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), 200)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
      var result = await _authService.AdminLoginAsync(request);
      return result.Success ? Ok(result) : BadRequest(result);
    }
  }
}
