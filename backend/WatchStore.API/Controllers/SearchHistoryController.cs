using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
    [Authorize]
    [ApiExplorerSettings(GroupName = "user")]
    public class SearchHistoryController : BaseApiController
    {
        private readonly ISearchHistoryService _searchHistoryService;

        public SearchHistoryController(ISearchHistoryService searchHistoryService)
        {
            _searchHistoryService = searchHistoryService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<SearchHistoryDto>>), 200)]
        public async Task<IActionResult> GetMySearchHistory([FromQuery] int limit = 10)
        {
            var userId = GetCurrentUserId();
            var result = await _searchHistoryService.GetUserSearchHistoryAsync(userId, limit);
            return HandleResponse(result);
        }

        [HttpDelete]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> ClearMySearchHistory()
        {
            var userId = GetCurrentUserId();
            var result = await _searchHistoryService.ClearUserSearchHistoryAsync(userId);
            return HandleResponse(result);
        }
    }
}
