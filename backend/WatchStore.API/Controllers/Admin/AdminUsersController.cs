using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers.Admin
{
  [ApiController]
  [Route("api/admin/users")]
  [Authorize(Roles = "Admin")]
  [ApiExplorerSettings(GroupName = "admin")]
  public class AdminUsersController : ControllerBase
  {
    private readonly IUserService _userService;

    public AdminUsersController(IUserService userService)
    {
      _userService = userService;
    }

    /// <summary>
    /// Get users with filters and pagination (Admin)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<AdminUserDto>>), 200)]
    public async Task<IActionResult> GetAll([FromQuery] UserAdminFilterDto filter, [FromQuery] PaginationParams pagination)
    {
      var result = await _userService.GetUsersAsync(filter, pagination);
      return Ok(result);
    }

    /// <summary>
    /// Get a single user with roles (Admin)
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<AdminUserDto>), 200)]
    public async Task<IActionResult> GetById(int id)
    {
      var result = await _userService.GetUserAdminAsync(id);
      return result.Success ? Ok(result) : NotFound(result);
    }

    /// <summary>
    /// Update user roles (Admin)
    /// </summary>
    [HttpPut("{id}/roles")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> UpdateRoles(int id, [FromBody] UpdateUserRolesDto dto)
    {
      var result = await _userService.UpdateUserRolesAsync(id, dto);
      return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Update user status (soft delete/restore) (Admin)
    /// </summary>
    [HttpPatch("{id}/status")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateUserStatusDto dto)
    {
      var result = await _userService.UpdateUserStatusAsync(id, dto);
      return result.Success ? Ok(result) : BadRequest(result);
    }
  }
}
