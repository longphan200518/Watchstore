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
    [Authorize]
    public class UserAddressesController : ControllerBase
    {
        private readonly IUserAddressService _addressService;

        public UserAddressesController(IUserAddressService addressService)
        {
            _addressService = addressService;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("Không xác định được người dùng");
            }
            return userId;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyAddresses()
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _addressService.GetUserAddressesAsync(userId);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse(ex.Message));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAddressById(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _addressService.GetUserAddressByIdAsync(userId, id);
                return result.Success ? Ok(result) : NotFound(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse(ex.Message));
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAddress([FromBody] CreateUserAddressDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _addressService.CreateUserAddressAsync(userId, dto);
                return result.Success ? Ok(result) : BadRequest(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse(ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAddress(int id, [FromBody] UpdateUserAddressDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _addressService.UpdateUserAddressAsync(userId, id, dto);
                return result.Success ? Ok(result) : BadRequest(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _addressService.DeleteUserAddressAsync(userId, id);
                return result.Success ? Ok(result) : BadRequest(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse(ex.Message));
            }
        }

        [HttpPost("{id}/default")]
        public async Task<IActionResult> SetDefaultAddress(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _addressService.SetDefaultAddressAsync(userId, id);
                return result.Success ? Ok(result) : BadRequest(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse(ex.Message));
            }
        }
    }
}
