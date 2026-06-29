using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
    public interface IWishlistService
    {
        Task<ApiResponse<List<WishlistItemDto>>> GetWishlistAsync(int userId);
        Task<ApiResponse<bool>> AddToWishlistAsync(int userId, int watchId);
        Task<ApiResponse<bool>> RemoveFromWishlistAsync(int userId, int watchId);
        Task<ApiResponse<bool>> IsInWishlistAsync(int userId, int watchId);
        Task<ApiResponse<bool>> ClearWishlistAsync(int userId);
    }
}
