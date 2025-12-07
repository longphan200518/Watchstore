using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers.Admin
{
  [ApiController]
  [Route("api/admin/dashboard")]
  [Authorize(Roles = "Admin")]
  [ApiExplorerSettings(GroupName = "admin")]
  public class AdminDashboardController : ControllerBase
  {
    private readonly IDashboardService _dashboardService;

    public AdminDashboardController(IDashboardService dashboardService)
    {
      _dashboardService = dashboardService;
    }

    /// <summary>
    /// Dashboard summary: revenue, orders by status, revenue by date, top products
    /// </summary>
    [HttpGet("summary")]
    [ProducesResponseType(typeof(ApiResponse<DashboardSummaryDto>), 200)]
    public async Task<IActionResult> GetSummary([FromQuery] DashboardFilterDto filter)
    {
      var result = await _dashboardService.GetSummaryAsync(filter);
      return result.Success ? Ok(result) : BadRequest(result);
    }
  }
}
