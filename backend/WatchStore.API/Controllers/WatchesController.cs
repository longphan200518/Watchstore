using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
    [ApiExplorerSettings(GroupName = "user")]
    public class WatchesController : BaseApiController
    {
        private readonly IWatchService _watchService;

        public WatchesController(IWatchService watchService)
        {
            _watchService = watchService;
        }

        /// <summary>
        /// Get all watches with filters and pagination
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PagedResponse<WatchDto>>), 200)]
        public async Task<IActionResult> GetAll(
            [FromQuery] WatchFilterDto filter,
            [FromQuery] PaginationParams pagination)
        {
            var result = await _watchService.GetAllAsync(filter, pagination);
            return HandleResponse(result);
        }

        /// <summary>
        /// Get watch by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<WatchDto>), 200)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _watchService.GetByIdAsync(id);
            return HandleResponse(result);
        }
    }
}
