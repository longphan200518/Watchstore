using WatchStore.Application.DTOs;
using WatchStore.Application.Common;

namespace WatchStore.Application.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginRequestDto request);
        Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto request);
        Task<ApiResponse<UserDto>> GetCurrentUserAsync(int userId);
        Task<ApiResponse<bool>> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    }
}
