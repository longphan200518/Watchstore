using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
    [ApiExplorerSettings(GroupName = "user")]
    public class ShippingController : BaseApiController
    {
        private readonly IShippingService _shippingService;

        public ShippingController(IShippingService shippingService)
        {
            _shippingService = shippingService;
        }

        [HttpPost("estimate")]
        [ProducesResponseType(typeof(ApiResponse<List<ShippingEstimateResponseDto>>), 200)]
        public async Task<IActionResult> EstimateFee([FromBody] ShippingEstimateRequestDto request)
        {
            var result = await _shippingService.EstimateShippingFeesAsync(request);
            return HandleResponse(result);
        }

        [HttpGet("provinces")]
        public async Task<IActionResult> GetProvinces()
        {
            var result = await _shippingService.GetProvincesAsync();
            return HandleResponse(result);
        }

        [HttpGet("districts/{provinceId}")]
        public async Task<IActionResult> GetDistricts(int provinceId)
        {
            var result = await _shippingService.GetDistrictsAsync(provinceId);
            return HandleResponse(result);
        }

        [HttpGet("wards/{districtId}")]
        public async Task<IActionResult> GetWards(int districtId)
        {
            var result = await _shippingService.GetWardsAsync(districtId);
            return HandleResponse(result);
        }
    }
}
