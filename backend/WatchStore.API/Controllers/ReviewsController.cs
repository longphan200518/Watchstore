using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ReviewsController : ControllerBase
  {
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
      _reviewService = reviewService;
    }

    // GET: api/reviews/watch/{watchId}
    [HttpGet("watch/{watchId}")]
    public async Task<IActionResult> GetReviewsByWatchId(
        int watchId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
      var pagination = new PaginationParams
      {
        PageNumber = pageNumber,
        PageSize = pageSize
      };

      var result = await _reviewService.GetReviewsByWatchIdAsync(watchId, pagination);
      return Ok(result);
    }

    // GET: api/reviews/watch/{watchId}/summary
    [HttpGet("watch/{watchId}/summary")]
    public async Task<IActionResult> GetReviewSummary(int watchId)
    {
      var result = await _reviewService.GetReviewSummaryAsync(watchId);
      return Ok(result);
    }

    // GET: api/reviews/user (requires authentication)
    [HttpGet("user")]
    [Authorize]
    public async Task<IActionResult> GetMyReviews(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
      var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
      {
        return Unauthorized(ApiResponse<object>.ErrorResponse("Không xác định được người dùng"));
      }

      var pagination = new PaginationParams
      {
        PageNumber = pageNumber,
        PageSize = pageSize
      };

      var result = await _reviewService.GetReviewsByUserIdAsync(userId, pagination);
      return Ok(result);
    }

    // GET: api/reviews/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetReviewById(int id)
    {
      var result = await _reviewService.GetReviewByIdAsync(id);
      return Ok(result);
    }

    // POST: api/reviews (requires authentication)
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto)
    {
      var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
      {
        return Unauthorized(ApiResponse<object>.ErrorResponse("Không xác định được người dùng"));
      }

      var result = await _reviewService.CreateReviewAsync(userId, dto);

      if (!result.Success)
      {
        return BadRequest(result);
      }

      return Ok(result);
    }

    // PUT: api/reviews/{id} (requires authentication)
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateReview(int id, [FromBody] UpdateReviewDto dto)
    {
      var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
      {
        return Unauthorized(ApiResponse<object>.ErrorResponse("Không xác định được người dùng"));
      }

      var result = await _reviewService.UpdateReviewAsync(userId, id, dto);

      if (!result.Success)
      {
        return BadRequest(result);
      }

      return Ok(result);
    }

    // DELETE: api/reviews/{id} (requires authentication)
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(int id)
    {
      var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
      {
        return Unauthorized(ApiResponse<object>.ErrorResponse("Không xác định được người dùng"));
      }

      var result = await _reviewService.DeleteReviewAsync(userId, id);

      if (!result.Success)
      {
        return BadRequest(result);
      }

      return Ok(result);
    }

    // POST: api/reviews/{id}/helpful
    [HttpPost("{id}/helpful")]
    public async Task<IActionResult> MarkReviewHelpful(int id)
    {
      var result = await _reviewService.MarkReviewHelpfulAsync(id);
      return Ok(result);
    }
  }
}
