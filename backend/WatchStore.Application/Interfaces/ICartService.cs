using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
  public interface ICartService
  {
    Task<ApiResponse<CartDto>> GetCartAsync(int? userId = null);
    Task<ApiResponse<CartDto>> AddItemAsync(AddCartItemDto dto, int? userId = null);
    Task<ApiResponse<CartDto>> UpdateItemAsync(UpdateCartItemDto dto, int? userId = null);
    Task<ApiResponse<bool>> RemoveItemAsync(int watchId, int? userId = null);
    Task<ApiResponse<CartDto>> ClearCartAsync(int? userId = null);
    Task<ApiResponse<CartDto>> MergeSessionCartToUserAsync(int userId);
  }
}