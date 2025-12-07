using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;

namespace WatchStore.Application.Features.Users
{
  public class UserService : IUserService
  {
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;

    public UserService(UserManager<User> userManager, RoleManager<Role> roleManager)
    {
      _userManager = userManager;
      _roleManager = roleManager;
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

    public async Task<ApiResponse<PagedResponse<AdminUserDto>>> GetUsersAsync(UserAdminFilterDto filter, PaginationParams pagination)
    {
      try
      {
        var query = _userManager.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
          var term = filter.SearchTerm.ToLower();
          query = query.Where(u =>
              u.Email!.ToLower().Contains(term) ||
              u.FullName.ToLower().Contains(term) ||
              (u.PhoneNumber != null && u.PhoneNumber.ToLower().Contains(term)));
        }

        if (filter.IsDeleted.HasValue)
        {
          query = query.Where(u => u.IsDeleted == filter.IsDeleted.Value);
        }

        var usersList = await query
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        if (!string.IsNullOrWhiteSpace(filter.Role))
        {
          var usersInRole = await _userManager.GetUsersInRoleAsync(filter.Role);
          var roleUserIds = usersInRole.Select(u => u.Id).ToHashSet();
          usersList = usersList.Where(u => roleUserIds.Contains(u.Id)).ToList();
        }

        var total = usersList.Count;
        var pagedUsers = usersList
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToList();

        var adminDtos = new List<AdminUserDto>();

        foreach (var user in pagedUsers)
        {
          var roles = await _userManager.GetRolesAsync(user);
          adminDtos.Add(new AdminUserDto
          {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber,
            EmailConfirmed = user.EmailConfirmed,
            CreatedAt = user.CreatedAt,
            IsDeleted = user.IsDeleted,
            Roles = roles.ToList()
          });
        }

        var response = new PagedResponse<AdminUserDto>
        {
          Items = adminDtos,
          PageNumber = pagination.PageNumber,
          PageSize = pagination.PageSize,
          TotalRecords = total,
          TotalPages = (int)Math.Ceiling(total / (double)pagination.PageSize)
        };

        return ApiResponse<PagedResponse<AdminUserDto>>.SuccessResponse(response);
      }
      catch (Exception ex)
      {
        return ApiResponse<PagedResponse<AdminUserDto>>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<AdminUserDto>> GetUserAdminAsync(int userId)
    {
      try
      {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
          return ApiResponse<AdminUserDto>.ErrorResponse("Người dùng không được tìm thấy");

        var roles = await _userManager.GetRolesAsync(user);

        var dto = new AdminUserDto
        {
          Id = user.Id,
          Email = user.Email ?? string.Empty,
          FullName = user.FullName,
          PhoneNumber = user.PhoneNumber,
          EmailConfirmed = user.EmailConfirmed,
          CreatedAt = user.CreatedAt,
          IsDeleted = user.IsDeleted,
          Roles = roles.ToList()
        };

        return ApiResponse<AdminUserDto>.SuccessResponse(dto);
      }
      catch (Exception ex)
      {
        return ApiResponse<AdminUserDto>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<bool>> UpdateUserRolesAsync(int userId, UpdateUserRolesDto dto)
    {
      try
      {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
          return ApiResponse<bool>.ErrorResponse("Người dùng không được tìm thấy");

        // Validate roles exist
        foreach (var role in dto.Roles)
        {
          if (!await _roleManager.RoleExistsAsync(role))
            return ApiResponse<bool>.ErrorResponse($"Role không tồn tại: {role}");
        }

        var currentRoles = await _userManager.GetRolesAsync(user);

        var toRemove = currentRoles.Except(dto.Roles).ToList();
        var toAdd = dto.Roles.Except(currentRoles).ToList();

        if (toRemove.Any())
        {
          var removeResult = await _userManager.RemoveFromRolesAsync(user, toRemove);
          if (!removeResult.Succeeded)
            return ApiResponse<bool>.ErrorResponse(string.Join(", ", removeResult.Errors.Select(e => e.Description)));
        }

        if (toAdd.Any())
        {
          var addResult = await _userManager.AddToRolesAsync(user, toAdd);
          if (!addResult.Succeeded)
            return ApiResponse<bool>.ErrorResponse(string.Join(", ", addResult.Errors.Select(e => e.Description)));
        }

        return ApiResponse<bool>.SuccessResponse(true, "Cập nhật vai trò thành công");
      }
      catch (Exception ex)
      {
        return ApiResponse<bool>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<bool>> UpdateUserStatusAsync(int userId, UpdateUserStatusDto dto)
    {
      try
      {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
          return ApiResponse<bool>.ErrorResponse("Người dùng không được tìm thấy");

        user.IsDeleted = dto.IsDeleted;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
          var errors = string.Join(", ", result.Errors.Select(e => e.Description));
          return ApiResponse<bool>.ErrorResponse(errors);
        }

        return ApiResponse<bool>.SuccessResponse(true, "Cập nhật trạng thái người dùng thành công");
      }
      catch (Exception ex)
      {
        return ApiResponse<bool>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }
  }
}
