using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
    public interface ICartService
    {
        /// <summary>Lấy giỏ hàng. userId != null → lấy theo user, ngược lại lấy theo sessionId.</summary>
        Task<ApiResponse<CartDto>> GetCartAsync(int? userId, string? sessionId);

        /// <summary>
        /// Thêm sản phẩm vào giỏ.
        /// Nếu sản phẩm đã tồn tại → tăng số lượng thay vì tạo dòng mới.
        /// </summary>
        Task<ApiResponse<CartDto>> AddToCartAsync(int? userId, string? sessionId, AddToCartDto dto);

        /// <summary>Cập nhật số lượng một item trong giỏ.</summary>
        Task<ApiResponse<CartDto>> UpdateQuantityAsync(int? userId, string? sessionId, int cartItemId, UpdateCartItemDto dto);

        /// <summary>Xóa một item khỏi giỏ hàng.</summary>
        Task<ApiResponse<bool>> RemoveItemAsync(int? userId, string? sessionId, int cartItemId);

        /// <summary>Xóa toàn bộ giỏ hàng.</summary>
        Task<ApiResponse<bool>> ClearCartAsync(int? userId, string? sessionId);

        /// <summary>
        /// Merge giỏ hàng Session vào giỏ hàng của user (gọi sau khi đăng nhập).
        /// Nếu cùng sản phẩm → cộng dồn số lượng.
        /// </summary>
        Task<ApiResponse<CartDto>> MergeCartAsync(string sessionId, int userId);
    }
}
