using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
    public interface IInventoryService
    {
        Task<ApiResponse<PagedResponse<InventoryItemDto>>> GetInventoryAsync(PaginationParams pagination, string? search = null);
        Task<ApiResponse<PagedResponse<InventoryTransactionDto>>> GetTransactionsAsync(int? watchId, PaginationParams pagination);
        Task<ApiResponse<bool>> AdjustStockAsync(AdjustStockDto dto, int adminUserId);
    }
}
