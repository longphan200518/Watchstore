using Microsoft.AspNetCore.Identity;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;

namespace WatchStore.Application.Features.Users
{
  public class UserService : IUserService
  {
    private readonly UserManager<User> _userManager;

    public UserService(UserManager<User> userManager)
    {
      _userManager = userManager;
    }

    /// <summary>
    /// Update user profile (FullName, PhoneNumber)
    /// </summary>
    public async Task<ApiResponse<UserDto>> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
      try
      {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
          return ApiResponse<UserDto>.ErrorResponse("Người dùng không được tìm thấy");

        // Update profile
        user.FullName = dto.FullName;
        user.PhoneNumber = dto.PhoneNumber;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
          var errors = string.Join(", ", result.Errors.Select(e => e.Description));
          return ApiResponse<UserDto>.ErrorResponse($"Lỗi cập nhật hồ sơ: {errors}");
        }

        var userDto = new UserDto
        {
          Id = user.Id,
          Email = user.Email,
          FullName = user.FullName,
          PhoneNumber = user.PhoneNumber
        };

        return ApiResponse<UserDto>.SuccessResponse(userDto, "Cập nhật hồ sơ thành công");
      }
      catch (Exception ex)
      {
        return ApiResponse<UserDto>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    /// <summary>
    /// Change user password
    /// </summary>
    public async Task<ApiResponse<bool>> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
    {
      try
      {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
          return ApiResponse<bool>.ErrorResponse("Người dùng không được tìm thấy");

        var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        if (!result.Succeeded)
        {
          // Check if it's wrong current password
          if (result.Errors.Any(e => e.Code.Contains("PasswordMismatch")))
            return ApiResponse<bool>.ErrorResponse("Mật khẩu hiện tại không đúng");

          var errors = string.Join(", ", result.Errors.Select(e => e.Description));
          return ApiResponse<bool>.ErrorResponse($"Lỗi đổi mật khẩu: {errors}");
        }

        return ApiResponse<bool>.SuccessResponse(true, "Đổi mật khẩu thành công");
      }
      catch (Exception ex)
      {
        return ApiResponse<bool>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    public async Task<ApiResponse<UserDto>> GetUserAsync(int userId)
    {
      try
      {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
          return ApiResponse<UserDto>.ErrorResponse("Người dùng không được tìm thấy");

        var userDto = new UserDto
        {
          Id = user.Id,
          Email = user.Email,
          FullName = user.FullName,
          PhoneNumber = user.PhoneNumber
        };

        return ApiResponse<UserDto>.SuccessResponse(userDto, "Lấy thông tin người dùng thành công");
      }
      catch (Exception ex)
      {
        return ApiResponse<UserDto>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }
  }
}
