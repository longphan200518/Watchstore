using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
  public interface IDashboardService
  {
    Task<ApiResponse<DashboardSummaryDto>> GetSummaryAsync(DashboardFilterDto filter);
  }
}
