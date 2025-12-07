using WatchStore.Application.DTOs;
using WatchStore.Application.Common;
using WatchStore.Domain.Enums;

namespace WatchStore.Application.Interfaces
{
    public interface IOrderService
    {
        Task<ApiResponse<OrderDto>> CreateAsync(CreateOrderDto dto, int userId);
        Task<ApiResponse<PagedResponse<OrderDto>>> GetUserOrdersAsync(int userId, PaginationParams pagination);
        Task<ApiResponse<PagedResponse<OrderDto>>> GetAllOrdersAsync(PaginationParams pagination);
        Task<ApiResponse<OrderDto>> GetByIdAsync(int id, int? userId = null);
        Task<ApiResponse<bool>> UpdateStatusAsync(int orderId, OrderStatus status);
        Task<ApiResponse<bool>> CancelOrderAsync(int orderId, int userId);
    }
}
