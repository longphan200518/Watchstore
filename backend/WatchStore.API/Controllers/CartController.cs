using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
    [ApiController]
    [Route("api/cart")]
    [ApiExplorerSettings(GroupName = "user")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        // ─── Helper lấy userId và sessionId từ request ───────────────────
        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return claim != null ? int.Parse(claim) : null;
        }

        private string? GetSessionId()
        {
            // SessionId do client tạo (UUID) và gửi qua header X-Session-Id
            return Request.Headers["X-Session-Id"].FirstOrDefault();
        }

        // ─── GET /api/cart ────────────────────────────────────────────────
        /// <summary>Lấy giỏ hàng hiện tại (theo user hoặc session)</summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetUserId();
            var sessionId = GetSessionId();

            if (userId == null && string.IsNullOrEmpty(sessionId))
                return BadRequest(new { message = "Cần cung cấp X-Session-Id header hoặc đăng nhập" });

            var result = await _cartService.GetCartAsync(userId, sessionId);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ─── POST /api/cart/items ─────────────────────────────────────────
        /// <summary>Thêm sản phẩm vào giỏ (tăng số lượng nếu đã có)</summary>
        [HttpPost("items")]
        [AllowAnonymous]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var sessionId = GetSessionId();

            if (userId == null && string.IsNullOrEmpty(sessionId))
                return BadRequest(new { message = "Cần cung cấp X-Session-Id header hoặc đăng nhập" });

            var result = await _cartService.AddToCartAsync(userId, sessionId, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ─── PUT /api/cart/items/{id} ─────────────────────────────────────
        /// <summary>Cập nhật số lượng một sản phẩm trong giỏ</summary>
        [HttpPut("items/{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateQuantity(int id, [FromBody] UpdateCartItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var sessionId = GetSessionId();

            var result = await _cartService.UpdateQuantityAsync(userId, sessionId, id, dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ─── DELETE /api/cart/items/{id} ──────────────────────────────────
        /// <summary>Xóa một sản phẩm khỏi giỏ hàng</summary>
        [HttpDelete("items/{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> RemoveItem(int id)
        {
            var userId = GetUserId();
            var sessionId = GetSessionId();

            var result = await _cartService.RemoveItemAsync(userId, sessionId, id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ─── DELETE /api/cart ──────────────────────────────────────────────
        /// <summary>Xóa toàn bộ giỏ hàng</summary>
        [HttpDelete]
        [AllowAnonymous]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetUserId();
            var sessionId = GetSessionId();

            var result = await _cartService.ClearCartAsync(userId, sessionId);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ─── POST /api/cart/merge ──────────────────────────────────────────
        /// <summary>
        /// Merge giỏ hàng session vào giỏ hàng user (gọi ngay sau khi đăng nhập thành công).
        /// Yêu cầu xác thực JWT.
        /// </summary>
        [HttpPost("merge")]
        [Authorize]
        public async Task<IActionResult> MergeCart([FromBody] MergeCartDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var result = await _cartService.MergeCartAsync(dto.SessionId, userId.Value);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
