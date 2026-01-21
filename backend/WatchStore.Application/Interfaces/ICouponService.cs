using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
  public interface ICouponService
  {
    Task<ApiResponse<PagedResponse<CouponDto>>> GetAllCouponsAsync(PaginationParams paginationParams);
    Task<ApiResponse<CouponDto>> GetCouponByIdAsync(int id);
    Task<ApiResponse<CouponDto>> GetCouponByCodeAsync(string code);
    Task<ApiResponse<CouponDto>> CreateCouponAsync(CreateCouponDto dto);
    Task<ApiResponse<CouponDto>> UpdateCouponAsync(UpdateCouponDto dto);
    Task<ApiResponse<bool>> DeleteCouponAsync(int id);
    Task<ApiResponse<CouponValidationResult>> ValidateCouponAsync(ValidateCouponDto dto);
    Task<ApiResponse<List<CouponDto>>> GetActiveCouponsAsync();
  }
}
