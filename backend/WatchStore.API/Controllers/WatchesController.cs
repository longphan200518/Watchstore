using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace WatchStore.API.Controllers
{
    [ApiExplorerSettings(GroupName = "user")]
    public class WatchesController : BaseApiController
    {
        private readonly IWatchService _watchService;
        private readonly ISearchHistoryService _searchHistoryService;

        public WatchesController(IWatchService watchService, ISearchHistoryService searchHistoryService)
        {
            _watchService = watchService;
            _searchHistoryService = searchHistoryService;
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
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm) && User.Identity?.IsAuthenticated == true)
            {
                try
                {
                    var userId = GetCurrentUserId();
                    await _searchHistoryService.LogSearchAsync(userId, filter.SearchTerm);
                }
                catch { /* ignore errors from logging */ }
            }

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

        /// <summary>
        /// Get related watches
        /// </summary>
        [HttpGet("{id}/related")]
        [ProducesResponseType(typeof(ApiResponse<List<WatchDto>>), 200)]
        public async Task<IActionResult> GetRelated(int id, [FromQuery] int limit = 4)
        {
            var result = await _watchService.GetRelatedWatchesAsync(id, limit);
            return HandleResponse(result);
        }
        // ─── SOCIAL PROOF & CROSS-SELL ──────────────────────────────────────
        [HttpGet("{id}/social-proof")]
        [AllowAnonymous]
        public async Task<IActionResult> GetWatchSocialProof(int id)
        {
            var result = await _watchService.GetWatchSocialProofAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{id}/cross-sell")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCrossSellWatches(int id, [FromQuery] int limit = 4)
        {
            var result = await _watchService.GetCrossSellWatchesAsync(id, limit);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
