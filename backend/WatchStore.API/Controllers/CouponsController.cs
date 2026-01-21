using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
  public class CouponsController : BaseApiController
  {
    private readonly ICouponService _couponService;

    public CouponsController(ICouponService couponService)
    {
      _couponService = couponService;
    }

    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<List<CouponDto>>>> GetActiveCoupons()
    {
      var response = await _couponService.GetActiveCouponsAsync();
      return Ok(response);
    }

    [HttpPost("validate")]
    public async Task<ActionResult<ApiResponse<CouponValidationResult>>> ValidateCoupon(ValidateCouponDto dto)
    {
      var response = await _couponService.ValidateCouponAsync(dto);
      return Ok(response);
    }
  }
}
