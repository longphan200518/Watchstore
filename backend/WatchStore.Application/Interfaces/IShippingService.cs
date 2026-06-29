using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
    public interface IShippingService
    {
        Task<ApiResponse<List<ShippingEstimateResponseDto>>> EstimateShippingFeesAsync(ShippingEstimateRequestDto request);
        Task<ApiResponse<object>> GetProvincesAsync();
        Task<ApiResponse<object>> GetDistrictsAsync(int provinceId);
        Task<ApiResponse<object>> GetWardsAsync(int districtId);
    }
}
