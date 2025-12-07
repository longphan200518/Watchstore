using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;

namespace WatchStore.API.Controllers
{
    /// <summary>
    /// Base controller with common functionality
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseApiController : ControllerBase
    {
        /// <summary>
        /// Return success response
        /// </summary>
        protected IActionResult Success<T>(T data, string message = "Success")
        {
            var response = ApiResponse<T>.SuccessResponse(data, message);
            return Ok(response);
        }

        /// <summary>
        /// Return created response
        /// </summary>
        protected IActionResult Created<T>(T data, string actionName, object routeValues)
        {
            var response = ApiResponse<T>.SuccessResponse(data, "Created successfully");
            return CreatedAtAction(actionName, routeValues, response);
        }

        /// <summary>
        /// Return error response based on ApiResponse
        /// </summary>
        protected IActionResult HandleResponse<T>(ApiResponse<T> response)
        {
            if (response.Success)
            {
                return Ok(response);
            }

            // Determine appropriate status code based on error message
            if (response.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
            {
                return NotFound(response);
            }

            if (response.Message.Contains("unauthorized", StringComparison.OrdinalIgnoreCase))
            {
                return Unauthorized(response);
            }

            return BadRequest(response);
        }

        /// <summary>
        /// Get current user ID from claims
        /// </summary>
        protected int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            return userId;
        }

        /// <summary>
        /// Check if current user is admin
        /// </summary>
        protected bool IsAdmin()
        {
            return User.IsInRole("Admin");
        }
    }
}
