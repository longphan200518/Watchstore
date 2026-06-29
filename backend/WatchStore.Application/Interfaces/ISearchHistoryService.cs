using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
    public interface ISearchHistoryService
    {
        Task LogSearchAsync(int userId, string searchTerm);
        Task<ApiResponse<List<SearchHistoryDto>>> GetUserSearchHistoryAsync(int userId, int limit = 10);
        Task<ApiResponse<bool>> ClearUserSearchHistoryAsync(int userId);
    }
}
