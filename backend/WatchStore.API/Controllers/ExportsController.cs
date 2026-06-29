using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ExportsController : ControllerBase
    {
        private readonly IExportService _exportService;

        public ExportsController(IExportService exportService)
        {
            _exportService = exportService;
        }

        [HttpGet("orders")]
        public async Task<IActionResult> ExportOrders([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var data = await _exportService.ExportOrdersToExcelAsync(startDate, endDate);
            var fileName = $"Orders_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
            return File(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> ExportRevenue([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var data = await _exportService.ExportRevenueToExcelAsync(startDate, endDate);
            var fileName = $"Revenue_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
            return File(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }
    }
}
