using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
    [ApiController]
    [Route("api/inventory")]
    [ApiExplorerSettings(GroupName = "admin")]
    [Authorize(Roles = "Admin")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetInventory([FromQuery] PaginationParams pagination, [FromQuery] string? search)
        {
            var result = await _inventoryService.GetInventoryAsync(pagination, search);
            return Ok(result);
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactions([FromQuery] int? watchId, [FromQuery] PaginationParams pagination)
        {
            var result = await _inventoryService.GetTransactionsAsync(watchId, pagination);
            return Ok(result);
        }

        [HttpPost("adjust")]
        public async Task<IActionResult> AdjustStock([FromBody] AdjustStockDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdString, out int adminUserId))
                return Unauthorized();

            var result = await _inventoryService.AdjustStockAsync(dto, adminUserId);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
