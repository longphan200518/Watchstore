using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Services
{
    public class CouponService : BaseService, ICouponService
    {
        public CouponService(
            IUnitOfWork unitOfWork,
            IMemoryCache cache,
            ILogger<CouponService> logger) : base(unitOfWork, cache, logger)
        {
        }

        public async Task<ApiResponse<PagedResponse<CouponDto>>> GetAllCouponsAsync(PaginationParams paginationParams)
        {
            try
            {
                var query = UnitOfWork.GetRepository<Coupon>()
                    .GetQueryable()
                    .OrderByDescending(c => c.CreatedAt);

                var totalCount = await query.CountAsync();
                var items = await query
                    .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                    .Take(paginationParams.PageSize)
                    .ToListAsync();

                var dtos = items.Select(MapToDto).ToList();

                var pagedResponse = new PagedResponse<CouponDto>
                {
                    Items = dtos,
                    PageNumber = paginationParams.PageNumber,
                    PageSize = paginationParams.PageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)paginationParams.PageSize),
                    TotalRecords = totalCount
                };

                return ApiResponse<PagedResponse<CouponDto>>.SuccessResponse(pagedResponse);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error getting all coupons");
                return ApiResponse<PagedResponse<CouponDto>>.ErrorResponse($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CouponDto>> GetCouponByIdAsync(int id)
        {
            try
            {
                var coupon = await UnitOfWork.GetRepository<Coupon>()
                    .GetByIdAsync(id);

                if (coupon == null)
                    return ApiResponse<CouponDto>.ErrorResponse("Coupon not found");

                return ApiResponse<CouponDto>.SuccessResponse(MapToDto(coupon));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error getting coupon by id {Id}", id);
                return ApiResponse<CouponDto>.ErrorResponse($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CouponDto>> GetCouponByCodeAsync(string code)
        {
            try
            {
                var coupon = await UnitOfWork.GetRepository<Coupon>()
                    .GetQueryable()
                    .FirstOrDefaultAsync(c => c.Code.ToLower() == code.ToLower());

                if (coupon == null)
                    return ApiResponse<CouponDto>.ErrorResponse("Coupon not found");

                return ApiResponse<CouponDto>.SuccessResponse(MapToDto(coupon));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error getting coupon by code {Code}", code);
                return ApiResponse<CouponDto>.ErrorResponse($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CouponDto>> CreateCouponAsync(CreateCouponDto dto)
        {
            try
            {
                // Check if code already exists
                var existing = await UnitOfWork.GetRepository<Coupon>()
                    .GetQueryable()
                    .FirstOrDefaultAsync(c => c.Code.ToLower() == dto.Code.ToLower());

                if (existing != null)
                    return ApiResponse<CouponDto>.ErrorResponse("Coupon code already exists");

                var coupon = new Coupon
                {
                    Code = dto.Code.ToUpper(),
                    Description = dto.Description,
                    DiscountType = dto.DiscountType,
                    DiscountValue = dto.DiscountValue,
                    MinimumOrderValue = dto.MinimumOrderValue,
                    MaximumDiscountAmount = dto.MaximumDiscountAmount,
                    MaxUsageCount = dto.MaxUsageCount,
                    MaxUsagePerUser = dto.MaxUsagePerUser,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    IsActive = dto.IsActive
                };

                await UnitOfWork.GetRepository<Coupon>().AddAsync(coupon);
                await UnitOfWork.SaveChangesAsync();

                return ApiResponse<CouponDto>.SuccessResponse(MapToDto(coupon), "Coupon created successfully");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error creating coupon");
                return ApiResponse<CouponDto>.ErrorResponse($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CouponDto>> UpdateCouponAsync(UpdateCouponDto dto)
        {
            try
            {
                var coupon = await UnitOfWork.GetRepository<Coupon>().GetByIdAsync(dto.Id);

                if (coupon == null)
                    return ApiResponse<CouponDto>.ErrorResponse("Coupon not found");

                coupon.Description = dto.Description;
                coupon.DiscountValue = dto.DiscountValue;
                coupon.MinimumOrderValue = dto.MinimumOrderValue;
                coupon.MaximumDiscountAmount = dto.MaximumDiscountAmount;
                coupon.MaxUsageCount = dto.MaxUsageCount;
                coupon.MaxUsagePerUser = dto.MaxUsagePerUser;
                coupon.StartDate = dto.StartDate;
                coupon.EndDate = dto.EndDate;
                coupon.IsActive = dto.IsActive;

                await UnitOfWork.GetRepository<Coupon>().UpdateAsync(coupon);
                await UnitOfWork.SaveChangesAsync();

                return ApiResponse<CouponDto>.SuccessResponse(MapToDto(coupon), "Coupon updated successfully");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error updating coupon");
                return ApiResponse<CouponDto>.ErrorResponse($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteCouponAsync(int id)
        {
            try
            {
                var coupon = await UnitOfWork.GetRepository<Coupon>().GetByIdAsync(id);

                if (coupon == null)
                    return ApiResponse<bool>.ErrorResponse("Coupon not found");

                await UnitOfWork.GetRepository<Coupon>().DeleteAsync(coupon);
                await UnitOfWork.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResponse(true, "Coupon deleted successfully");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error deleting coupon");
                return ApiResponse<bool>.ErrorResponse($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CouponValidationResult>> ValidateCouponAsync(ValidateCouponDto dto)
        {
            try
            {
                var coupon = await UnitOfWork.GetRepository<Coupon>()
                    .GetQueryable()
                    .FirstOrDefaultAsync(c => c.Code.ToLower() == dto.Code.ToLower());

                if (coupon == null)
                {
                    return ApiResponse<CouponValidationResult>.SuccessResponse(new CouponValidationResult
                    {
                        IsValid = false,
                        Message = "Mã giảm giá không tồn tại"
                    });
                }

                // Check if active
                if (!coupon.IsActive)
                {
                    return ApiResponse<CouponValidationResult>.SuccessResponse(new CouponValidationResult
                    {
                        IsValid = false,
                        Message = "Mã giảm giá không hoạt động"
                    });
                }

                // Check date range
                var now = DateTime.UtcNow;
                if (now < coupon.StartDate)
                {
                    return ApiResponse<CouponValidationResult>.SuccessResponse(new CouponValidationResult
                    {
                        IsValid = false,
                        Message = "Mã giảm giá chưa có hiệu lực"
                    });
                }

                if (now > coupon.EndDate)
                {
                    return ApiResponse<CouponValidationResult>.SuccessResponse(new CouponValidationResult
                    {
                        IsValid = false,
                        Message = "Mã giảm giá đã hết hạn"
                    });
                }

                // Check usage limit
                if (coupon.MaxUsageCount.HasValue && coupon.UsageCount >= coupon.MaxUsageCount.Value)
                {
                    return ApiResponse<CouponValidationResult>.SuccessResponse(new CouponValidationResult
                    {
                        IsValid = false,
                        Message = "Mã giảm giá đã hết lượt sử dụng"
                    });
                }

                // Check minimum order value
                if (coupon.MinimumOrderValue.HasValue && dto.OrderTotal < coupon.MinimumOrderValue.Value)
                {
                    return ApiResponse<CouponValidationResult>.SuccessResponse(new CouponValidationResult
                    {
                        IsValid = false,
                        Message = $"Đơn hàng phải từ {coupon.MinimumOrderValue.Value:N0} VNĐ trở lên"
                    });
                }

                // Check per-user limit (if userId provided)
                if (dto.UserId.HasValue && coupon.MaxUsagePerUser.HasValue)
                {
                    var userUsageCount = await UnitOfWork.GetRepository<CouponUsage>()
                        .GetQueryable()
                        .CountAsync(cu => cu.CouponId == coupon.Id && cu.UserId == dto.UserId.Value);

                    if (userUsageCount >= coupon.MaxUsagePerUser.Value)
                    {
                        return ApiResponse<CouponValidationResult>.SuccessResponse(new CouponValidationResult
                        {
                            IsValid = false,
                            Message = "Bạn đã sử dụng hết lượt áp dụng mã giảm giá này"
                        });
                    }
                }

                // Calculate discount
                decimal discountAmount;
                if (coupon.DiscountType == 1) // Percentage
                {
                    discountAmount = dto.OrderTotal * (coupon.DiscountValue / 100);
                    if (coupon.MaximumDiscountAmount.HasValue && discountAmount > coupon.MaximumDiscountAmount.Value)
                    {
                        discountAmount = coupon.MaximumDiscountAmount.Value;
                    }
                }
                else // Fixed
                {
                    discountAmount = coupon.DiscountValue;
                }

                // Ensure discount doesn't exceed order total
                if (discountAmount > dto.OrderTotal)
                {
                    discountAmount = dto.OrderTotal;
                }

                return ApiResponse<CouponValidationResult>.SuccessResponse(new CouponValidationResult
                {
                    IsValid = true,
                    Message = "Mã giảm giá hợp lệ",
                    DiscountAmount = discountAmount,
                    Coupon = MapToDto(coupon)
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error validating coupon");
                return ApiResponse<CouponValidationResult>.ErrorResponse($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<CouponDto>>> GetActiveCouponsAsync()
        {
            try
            {
                var now = DateTime.UtcNow;
                var coupons = await UnitOfWork.GetRepository<Coupon>()
                    .GetQueryable()
                    .Where(c => c.IsActive && c.StartDate <= now && c.EndDate >= now)
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                var dtos = coupons.Select(MapToDto).ToList();

                return ApiResponse<List<CouponDto>>.SuccessResponse(dtos);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error getting active coupons");
                return ApiResponse<List<CouponDto>>.ErrorResponse($"Error: {ex.Message}");
            }
        }

        private CouponDto MapToDto(Coupon coupon)
        {
            return new CouponDto
            {
                Id = coupon.Id,
                Code = coupon.Code,
                Description = coupon.Description,
                DiscountType = coupon.DiscountType,
                DiscountValue = coupon.DiscountValue,
                MinimumOrderValue = coupon.MinimumOrderValue,
                MaximumDiscountAmount = coupon.MaximumDiscountAmount,
                MaxUsageCount = coupon.MaxUsageCount,
                MaxUsagePerUser = coupon.MaxUsagePerUser,
                UsageCount = coupon.UsageCount,
                StartDate = coupon.StartDate,
                EndDate = coupon.EndDate,
                IsActive = coupon.IsActive
            };
        }
    }
}
