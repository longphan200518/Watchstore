using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers.Admin
{
  [ApiController]
  [Route("api/admin/reviews")]
  [Authorize(Roles = "Admin")]
  [ApiExplorerSettings(GroupName = "admin")]
  public class AdminReviewsController : ControllerBase
  {
    private readonly IReviewService _reviewService;

    public AdminReviewsController(IReviewService reviewService)
    {
      _reviewService = reviewService;
    }

    /// <summary>
    /// Get all reviews with filters (Admin)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<ReviewDto>>), 200)]
    public async Task<IActionResult> GetAll([FromQuery] ReviewAdminFilterDto filter, [FromQuery] PaginationParams pagination)
    {
      var result = await _reviewService.GetAllReviewsAsync(filter, pagination);
      return Ok(result);
    }

    /// <summary>
    /// Get review by id (Admin)
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ReviewDto>), 200)]
    public async Task<IActionResult> GetById(int id)
    {
      var result = await _reviewService.GetReviewByIdAsync(id);
      return result.Success ? Ok(result) : NotFound(result);
    }

    /// <summary>
    /// Delete a review (Admin)
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _reviewService.AdminDeleteReviewAsync(id);
      return result.Success ? Ok(result) : NotFound(result);
    }
  }
}
