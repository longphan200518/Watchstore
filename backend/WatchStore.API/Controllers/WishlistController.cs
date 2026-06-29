using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
    [ApiController]
    [Route("api/wishlists")]
    [Authorize]
    [ApiExplorerSettings(GroupName = "user")]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        /// <summary>Lấy danh sách yêu thích của user</summary>
        [HttpGet]
        public async Task<IActionResult> GetMyWishlist()
        {
            var result = await _wishlistService.GetWishlistAsync(GetUserId());
            return Ok(result);
        }

        /// <summary>Thêm sản phẩm vào wishlist</summary>
        [HttpPost("{watchId:int}")]
        public async Task<IActionResult> Add(int watchId)
        {
            var result = await _wishlistService.AddToWishlistAsync(GetUserId(), watchId);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>Xóa sản phẩm khỏi wishlist</summary>
        [HttpDelete("{watchId:int}")]
        public async Task<IActionResult> Remove(int watchId)
        {
            var result = await _wishlistService.RemoveFromWishlistAsync(GetUserId(), watchId);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>Kiểm tra sản phẩm có trong wishlist không</summary>
        [HttpGet("{watchId:int}/check")]
        public async Task<IActionResult> Check(int watchId)
        {
            var result = await _wishlistService.IsInWishlistAsync(GetUserId(), watchId);
            return Ok(result);
        }

        /// <summary>Xóa toàn bộ wishlist</summary>
        [HttpDelete("clear")]
        public async Task<IActionResult> Clear()
        {
            var result = await _wishlistService.ClearWishlistAsync(GetUserId());
            return Ok(result);
        }
    }
}
