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
  }
}
