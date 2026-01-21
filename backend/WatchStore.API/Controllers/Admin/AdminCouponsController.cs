using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers.Admin
{
  [Authorize(Roles = "Admin")]
  public class AdminCouponsController : BaseApiController
  {
    private readonly ICouponService _couponService;

    public AdminCouponsController(ICouponService couponService)
    {
      _couponService = couponService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResponse<CouponDto>>>> GetAllCoupons(
        [FromQuery] PaginationParams paginationParams)
    {
      var response = await _couponService.GetAllCouponsAsync(paginationParams);
      return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CouponDto>>> GetCouponById(int id)
    {
      var response = await _couponService.GetCouponByIdAsync(id);
      if (!response.Success)
        return NotFound(response);
      return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CouponDto>>> CreateCoupon(CreateCouponDto dto)
    {
      var response = await _couponService.CreateCouponAsync(dto);
      if (!response.Success)
        return BadRequest(response);
      return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<CouponDto>>> UpdateCoupon(int id, UpdateCouponDto dto)
    {
      if (id != dto.Id)
        return BadRequest(ApiResponse<CouponDto>.ErrorResponse("ID mismatch"));

      var response = await _couponService.UpdateCouponAsync(dto);
      if (!response.Success)
        return BadRequest(response);
      return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCoupon(int id)
    {
      var response = await _couponService.DeleteCouponAsync(id);
      if (!response.Success)
        return NotFound(response);
      return Ok(response);
    }
  }
}
