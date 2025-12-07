using WatchStore.Application.DTOs;
using WatchStore.Application.Common;

namespace WatchStore.Application.Interfaces
{
    public interface IWatchService
    {
        Task<ApiResponse<PagedResponse<WatchDto>>> GetAllAsync(WatchFilterDto filter, PaginationParams pagination);
        Task<ApiResponse<WatchDto>> GetByIdAsync(int id);
        Task<ApiResponse<WatchDto>> CreateAsync(CreateWatchDto dto, int? sellerId = null);
        Task<ApiResponse<WatchDto>> UpdateAsync(UpdateWatchDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }
}
