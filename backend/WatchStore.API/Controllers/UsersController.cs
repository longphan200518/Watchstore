using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  [ApiExplorerSettings(GroupName = "user")]
  public class UsersController : ControllerBase
  {
    private readonly IAuthService _authService;
    private readonly IUserService _userService;

    public UsersController(IAuthService authService, IUserService userService)
    {
      _authService = authService;
      _userService = userService;
    }

    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("profile")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), 200)]
    public async Task<IActionResult> GetProfile()
    {
      var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
      var result = await _authService.GetCurrentUserAsync(userId);
      return result.Success ? Ok(result) : NotFound(result);
    }

    /// <summary>
    /// Update user profile (FullName, PhoneNumber)
    /// </summary>
    [HttpPut("profile")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), 200)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
      try
      {
        // Validate input
        if (string.IsNullOrWhiteSpace(dto.FullName) || string.IsNullOrWhiteSpace(dto.PhoneNumber))
        {
          return BadRequest(ApiResponse<UserDto>.ErrorResponse("FullName and PhoneNumber are required"));
        }

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _userService.UpdateProfileAsync(userId, dto);

        return result.Success ? Ok(result) : BadRequest(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ApiResponse<UserDto>.ErrorResponse($"Error: {ex.Message}"));
      }
    }

    /// <summary>
    /// Change user password
    /// </summary>
    [HttpPost("change-password")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
      try
      {
        // Validate input
        if (string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
        {
          return BadRequest(ApiResponse<bool>.ErrorResponse("CurrentPassword and NewPassword are required"));
        }

        if (dto.NewPassword.Length < 6)
        {
          return BadRequest(ApiResponse<bool>.ErrorResponse("New password must be at least 6 characters"));
        }

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _userService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);

        return result.Success ? Ok(result) : BadRequest(result);
      }
      catch (Exception ex)
      {
        return BadRequest(ApiResponse<bool>.ErrorResponse($"Error: {ex.Message}"));
      }
    }
  }
}
