using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Auth
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;

        public AuthService(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IJwtService jwtService,
            IEmailService emailService,
            IConfiguration configuration,
            IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
            _emailService = emailService;
            _configuration = configuration;
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginRequestDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return ApiResponse<AuthResponseDto>.ErrorResponse("Email hoặc mật khẩu không đúng");

            if (!user.EmailConfirmed)
                return ApiResponse<AuthResponseDto>.ErrorResponse("Email chưa được xác thực. Vui lòng xác thực email trước.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
                return ApiResponse<AuthResponseDto>.ErrorResponse("Email hoặc mật khẩu không đúng");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtService.GenerateToken(user.Id, user.Email!, roles.ToList());
            var expirationMinutes = _configuration.GetValue<int>("JwtSettings:ExpirationInMinutes");

            // Làm mới refresh token: xóa token cũ còn hiệu lực
            var refreshRepo = _unitOfWork.RefreshTokens;
            var oldTokens = (await refreshRepo.FindAsync(r => r.UserId == user.Id && !r.IsRevoked)).ToList();
            foreach (var old in oldTokens)
            {
                old.IsRevoked = true;
                old.RevokedAt = DateTime.UtcNow;
                await refreshRepo.UpdateAsync(old);
            }

            var newRefresh = await GenerateRefreshTokenAsync(user.Id, request.RememberMe);

            var response = new AuthResponseDto
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
                RefreshToken = newRefresh.Token,
                RefreshTokenExpiresAt = newRefresh.ExpiresAt,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FullName = user.FullName,
                    PhoneNumber = user.PhoneNumber,
                    Address = user.Address,
                    EmailConfirmed = user.EmailConfirmed,
                    Roles = roles.ToList()
                }
            };

            return ApiResponse<AuthResponseDto>.SuccessResponse(response, "Đăng nhập thành công");
        }

        public async Task<ApiResponse<AuthResponseDto>> AdminLoginAsync(LoginRequestDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return ApiResponse<AuthResponseDto>.ErrorResponse("Email hoặc mật khẩu không đúng");

            if (!user.EmailConfirmed)
                return ApiResponse<AuthResponseDto>.ErrorResponse("Email chưa được xác thực. Vui lòng xác thực email trước.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
                return ApiResponse<AuthResponseDto>.ErrorResponse("Email hoặc mật khẩu không đúng");

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains("Admin"))
                return ApiResponse<AuthResponseDto>.ErrorResponse("Tài khoản không có quyền Admin");

            var token = _jwtService.GenerateToken(user.Id, user.Email!, roles.ToList());
            var expirationMinutes = _configuration.GetValue<int>("JwtSettings:ExpirationInMinutes");

            var refreshRepo = _unitOfWork.RefreshTokens;
            var oldTokens = (await refreshRepo.FindAsync(r => r.UserId == user.Id && !r.IsRevoked)).ToList();
            foreach (var old in oldTokens)
            {
                old.IsRevoked = true;
                old.RevokedAt = DateTime.UtcNow;
                await refreshRepo.UpdateAsync(old);
            }

            var newRefresh = await GenerateRefreshTokenAsync(user.Id, request.RememberMe);

            var response = new AuthResponseDto
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
                RefreshToken = newRefresh.Token,
                RefreshTokenExpiresAt = newRefresh.ExpiresAt,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FullName = user.FullName,
                    PhoneNumber = user.PhoneNumber,
                    Address = user.Address,
                    EmailConfirmed = user.EmailConfirmed,
                    Roles = roles.ToList()
                }
            };

            return ApiResponse<AuthResponseDto>.SuccessResponse(response, "Đăng nhập admin thành công");
        }

        public async Task<ApiResponse<string>> RegisterAsync(RegisterRequestDto request)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
                return ApiResponse<string>.ErrorResponse("Email này đã được đăng ký");

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                EmailConfirmed = false
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ApiResponse<string>.ErrorResponse("Đăng ký thất bại", errors);
            }

            await _userManager.AddToRoleAsync(user, "User");

            // Tạo OTP để xác thực email
            var otp = GenerateOtp();
            var otpRecord = new OtpVerification
            {
                Email = request.Email,
                Otp = otp,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                Type = "email_verification"
            };

            var otpRepository = _unitOfWork.OtpVerifications;
            await otpRepository.AddAsync(otpRecord);
            await _unitOfWork.SaveChangesAsync();

            // Gửi email OTP
            await _emailService.SendVerificationEmailAsync(request.Email, otp);

            return ApiResponse<string>.SuccessResponse(otp, "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực.");
        }

        public async Task<ApiResponse<bool>> VerifyEmailAsync(string email, string otp)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return ApiResponse<bool>.ErrorResponse("Người dùng không tìm thấy");

            if (user.EmailConfirmed)
                return ApiResponse<bool>.ErrorResponse("Email đã được xác thực");

            var otpRepository = _unitOfWork.OtpVerifications;
            var otpRecords = (await otpRepository.FindAsync(
                o => o.Email == email && o.Type == "email_verification"))
                .OrderByDescending(o => o.CreatedAt)
                .ToList();

            var otpRecord = otpRecords.FirstOrDefault();

            if (otpRecord == null)
                return ApiResponse<bool>.ErrorResponse("Mã OTP không hợp lệ");

            if (DateTime.UtcNow > otpRecord.ExpiresAt)
                return ApiResponse<bool>.ErrorResponse("Mã OTP đã hết hạn");

            if (otpRecord.Attempts >= otpRecord.MaxAttempts)
                return ApiResponse<bool>.ErrorResponse("Vượt quá số lần thử tối đa");

            if (otpRecord.Otp != otp)
            {
                otpRecord.Attempts++;
                await otpRepository.UpdateAsync(otpRecord);
                await _unitOfWork.SaveChangesAsync();
                return ApiResponse<bool>.ErrorResponse("Mã OTP không chính xác");
            }

            // Xác thực email
            user.EmailConfirmed = true;
            user.EmailConfirmedAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            // Đánh dấu OTP đã được sử dụng
            otpRecord.IsVerified = true;
            await otpRepository.UpdateAsync(otpRecord);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Email xác thực thành công");
        }

        public async Task<ApiResponse<bool>> ResendVerificationOtpAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return ApiResponse<bool>.ErrorResponse("Người dùng không tìm thấy");

            if (user.EmailConfirmed)
                return ApiResponse<bool>.ErrorResponse("Email đã được xác thực");

            var otpRepository = _unitOfWork.OtpVerifications;
            // Xóa OTP cũ
            var oldOtps = (await otpRepository.FindAsync(
                o => o.Email == email && o.Type == "email_verification" && !o.IsVerified))
                .ToList();

            foreach (var oldOtp in oldOtps)
                await otpRepository.DeleteAsync(oldOtp);

            // Tạo OTP mới
            var otp = GenerateOtp();
            var otpRecord = new OtpVerification
            {
                Email = email,
                Otp = otp,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                Type = "email_verification"
            };

            await otpRepository.AddAsync(otpRecord);
            await _unitOfWork.SaveChangesAsync();

            // Gửi email
            await _emailService.SendVerificationEmailAsync(email, otp);

            return ApiResponse<bool>.SuccessResponse(true, "Mã OTP mới đã được gửi");
        }

        public async Task<ApiResponse<bool>> ForgotPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return ApiResponse<bool>.ErrorResponse("Email không được tìm thấy");

            var otpRepository = _unitOfWork.OtpVerifications;
            // Xóa OTP cũ
            var oldOtps = (await otpRepository.FindAsync(
                o => o.Email == email && o.Type == "password_reset" && !o.IsVerified))
                .ToList();

            foreach (var oldOtp in oldOtps)
                await otpRepository.DeleteAsync(oldOtp);

            // Tạo OTP mới
            var otp = GenerateOtp();
            var otpRecord = new OtpVerification
            {
                Email = email,
                Otp = otp,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                Type = "password_reset"
            };

            await otpRepository.AddAsync(otpRecord);
            await _unitOfWork.SaveChangesAsync();

            // Gửi email
            await _emailService.SendPasswordResetEmailAsync(email, otp);

            return ApiResponse<bool>.SuccessResponse(true, "Mã xác thực đã được gửi đến email của bạn");
        }

        public async Task<ApiResponse<bool>> VerifyResetOtpAsync(string email, string otp)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return ApiResponse<bool>.ErrorResponse("Người dùng không tìm thấy");

            var otpRepository = _unitOfWork.OtpVerifications;
            var otpRecords = (await otpRepository.FindAsync(
                o => o.Email == email && o.Type == "password_reset"))
                .OrderByDescending(o => o.CreatedAt)
                .ToList();

            var otpRecord = otpRecords.FirstOrDefault();

            if (otpRecord == null)
                return ApiResponse<bool>.ErrorResponse("Mã OTP không hợp lệ");

            if (DateTime.UtcNow > otpRecord.ExpiresAt)
                return ApiResponse<bool>.ErrorResponse("Mã OTP đã hết hạn");

            if (otpRecord.Attempts >= otpRecord.MaxAttempts)
                return ApiResponse<bool>.ErrorResponse("Vượt quá số lần thử tối đa");

            if (otpRecord.Otp != otp)
            {
                otpRecord.Attempts++;
                await otpRepository.UpdateAsync(otpRecord);
                await _unitOfWork.SaveChangesAsync();
                return ApiResponse<bool>.ErrorResponse("Mã OTP không chính xác");
            }

            // Đánh dấu OTP đã được xác thực
            otpRecord.IsVerified = true;
            await otpRepository.UpdateAsync(otpRecord);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Mã OTP xác thực thành công");
        }

        public async Task<ApiResponse<bool>> ResetPasswordAsync(string email, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return ApiResponse<bool>.ErrorResponse("Người dùng không tìm thấy");

            var otpRepository = _unitOfWork.OtpVerifications;
            // Kiểm tra OTP đã xác thực
            var otpRecords = (await otpRepository.FindAsync(
                o => o.Email == email && o.Type == "password_reset" && o.IsVerified))
                .OrderByDescending(o => o.CreatedAt)
                .ToList();

            var otpRecord = otpRecords.FirstOrDefault();

            if (otpRecord == null)
                return ApiResponse<bool>.ErrorResponse("Vui lòng xác thực OTP trước");

            if (DateTime.UtcNow > otpRecord.CreatedAt.AddMinutes(30))
                return ApiResponse<bool>.ErrorResponse("Hết thời gian để đặt lại mật khẩu");

            // Đặt lại mật khẩu
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ApiResponse<bool>.ErrorResponse("Đặt lại mật khẩu thất bại", errors);
            }

            return ApiResponse<bool>.SuccessResponse(true, "Mật khẩu đã được đặt lại thành công");
        }

        public async Task<ApiResponse<UserDto>> GetCurrentUserAsync(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return ApiResponse<UserDto>.ErrorResponse("Người dùng không tìm thấy");

            var roles = await _userManager.GetRolesAsync(user);
            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                EmailConfirmed = user.EmailConfirmed,
                Roles = roles.ToList()
            };

            return ApiResponse<UserDto>.SuccessResponse(userDto);
        }

        public async Task<ApiResponse<bool>> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return ApiResponse<bool>.ErrorResponse("Người dùng không tìm thấy");

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ApiResponse<bool>.ErrorResponse("Thay đổi mật khẩu thất bại", errors);
            }

            return ApiResponse<bool>.SuccessResponse(true, "Mật khẩu đã được thay đổi thành công");
        }

        public async Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string refreshToken)
        {
            var refreshRepo = _unitOfWork.RefreshTokens;
            var tokenRecord = (await refreshRepo.FindAsync(r => r.Token == refreshToken)).FirstOrDefault();

            if (tokenRecord == null || tokenRecord.IsRevoked)
                return ApiResponse<AuthResponseDto>.ErrorResponse("Refresh token không hợp lệ");

            if (DateTime.UtcNow > tokenRecord.ExpiresAt)
                return ApiResponse<AuthResponseDto>.ErrorResponse("Refresh token đã hết hạn");

            var user = await _userManager.FindByIdAsync(tokenRecord.UserId.ToString());
            if (user == null)
                return ApiResponse<AuthResponseDto>.ErrorResponse("Người dùng không tồn tại");

            var roles = await _userManager.GetRolesAsync(user);
            var newAccessToken = _jwtService.GenerateToken(user.Id, user.Email!, roles.ToList());
            var expirationMinutes = _configuration.GetValue<int>("JwtSettings:ExpirationInMinutes");

            // Rotate refresh token
            tokenRecord.IsRevoked = true;
            tokenRecord.RevokedAt = DateTime.UtcNow;
            await refreshRepo.UpdateAsync(tokenRecord);

            var newRefresh = await GenerateRefreshTokenAsync(user.Id, tokenRecord.RememberMe);

            var response = new AuthResponseDto
            {
                Token = newAccessToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
                RefreshToken = newRefresh.Token,
                RefreshTokenExpiresAt = newRefresh.ExpiresAt,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FullName = user.FullName,
                    PhoneNumber = user.PhoneNumber,
                    Address = user.Address,
                    EmailConfirmed = user.EmailConfirmed,
                    Roles = roles.ToList()
                }
            };

            return ApiResponse<AuthResponseDto>.SuccessResponse(response, "Làm mới token thành công");
        }

        private string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        private async Task<RefreshToken> GenerateRefreshTokenAsync(int userId, bool rememberMe)
        {
            var refreshRepo = _unitOfWork.RefreshTokens;
            var refreshToken = new RefreshToken
            {
                UserId = userId,
                Token = Guid.NewGuid().ToString("N"),
                ExpiresAt = DateTime.UtcNow.AddDays(rememberMe ? 30 : 7),
                RememberMe = rememberMe
            };

            await refreshRepo.AddAsync(refreshToken);
            await _unitOfWork.SaveChangesAsync();
            return refreshToken;
        }
    }
}
