using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
    public interface IAuthService
    {
        // Login & Register
        Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginRequestDto request);
        Task<ApiResponse<AuthResponseDto>> AdminLoginAsync(LoginRequestDto request);
        Task<ApiResponse<string>> RegisterAsync(RegisterRequestDto request);

        // Email Verification
        Task<ApiResponse<bool>> VerifyEmailAsync(string email, string otp);
        Task<ApiResponse<bool>> ResendVerificationOtpAsync(string email);

        // Password Reset
        Task<ApiResponse<bool>> ForgotPasswordAsync(string email);
        Task<ApiResponse<bool>> VerifyResetOtpAsync(string email, string otp);
        Task<ApiResponse<bool>> ResetPasswordAsync(string email, string newPassword);

        // Refresh Token
        Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string refreshToken);

        // User
        Task<ApiResponse<UserDto>> GetCurrentUserAsync(int userId);
        Task<ApiResponse<bool>> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    }
}
