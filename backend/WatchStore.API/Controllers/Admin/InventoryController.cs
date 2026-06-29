using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/inventory")]
    [Authorize(Roles = "Admin")]
    [ApiExplorerSettings(GroupName = "admin")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        /// <summary>Lấy danh sách tồn kho tất cả sản phẩm</summary>
        [HttpGet]
        public async Task<IActionResult> GetInventory(
            [FromQuery] PaginationParams pagination,
            [FromQuery] string? search = null)
        {
            var result = await _inventoryService.GetInventoryAsync(pagination, search);
            return Ok(result);
        }

        /// <summary>Lấy lịch sử giao dịch tồn kho</summary>
        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactions(
            [FromQuery] int? watchId,
            [FromQuery] PaginationParams pagination)
        {
            var result = await _inventoryService.GetTransactionsAsync(watchId, pagination);
            return Ok(result);
        }

        /// <summary>Điều chỉnh tồn kho thủ công</summary>
        [HttpPost("adjust")]
        public async Task<IActionResult> AdjustStock([FromBody] AdjustStockDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _inventoryService.AdjustStockAsync(dto, GetUserId());
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
