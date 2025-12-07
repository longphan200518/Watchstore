using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
  public interface IUserService
  {
    /// <summary>
    /// Update user profile (FullName, PhoneNumber)
    /// </summary>
    Task<ApiResponse<UserDto>> UpdateProfileAsync(int userId, UpdateProfileDto dto);

    /// <summary>
    /// Change user password
    /// </summary>
    Task<ApiResponse<bool>> ChangePasswordAsync(int userId, string currentPassword, string newPassword);

    /// <summary>
    /// Get user by ID
    /// </summary>
    Task<ApiResponse<UserDto>> GetUserAsync(int userId);

    /// <summary>
    /// Admin: get users with filters and pagination
    /// </summary>
    Task<ApiResponse<PagedResponse<AdminUserDto>>> GetUsersAsync(UserAdminFilterDto filter, PaginationParams pagination);

    /// <summary>
    /// Admin: get single user with roles
    /// </summary>
    Task<ApiResponse<AdminUserDto>> GetUserAdminAsync(int userId);

    /// <summary>
    /// Admin: update roles for a user
    /// </summary>
    Task<ApiResponse<bool>> UpdateUserRolesAsync(int userId, UpdateUserRolesDto dto);

    /// <summary>
    /// Admin: toggle user active/deleted flag
    /// </summary>
    Task<ApiResponse<bool>> UpdateUserStatusAsync(int userId, UpdateUserStatusDto dto);
  }
}
