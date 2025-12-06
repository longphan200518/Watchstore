using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
    public class WatchesController : BaseApiController
    {
        private readonly IWatchService _watchService;
        private readonly IValidator<CreateWatchDto> _createValidator;
        private readonly IValidator<UpdateWatchDto> _updateValidator;

        public WatchesController(
            IWatchService watchService,
            IValidator<CreateWatchDto> createValidator,
            IValidator<UpdateWatchDto> updateValidator)
        {
            _watchService = watchService;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        /// <summary>
        /// Get all watches with filters and pagination
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PagedResponse<WatchDto>>), 200)]
        [ResponseCache(Duration = 60, VaryByQueryKeys = new[] { "*" })]
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
        [ResponseCache(Duration = 300)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _watchService.GetByIdAsync(id);
            return HandleResponse(result);
        }

        /// <summary>
        /// Create new watch (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(ApiResponse<WatchDto>), 201)]
        public async Task<IActionResult> Create([FromBody] CreateWatchDto dto)
        {
            var validationResult = await _createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                return BadRequest(ApiResponse<WatchDto>.ErrorResponse(
                    "Validation failed",
                    validationResult.Errors.Select(e => e.ErrorMessage).ToList()));
            }

            var userId = GetCurrentUserId();
            var result = await _watchService.CreateAsync(dto, userId);
            
            return result.Success 
                ? Created(result.Data!, nameof(GetById), new { id = result.Data!.Id })
                : HandleResponse(result);
        }

        /// <summary>
        /// Update watch (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(ApiResponse<WatchDto>), 200)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateWatchDto dto)
        {
            if (id != dto.Id)
                return BadRequest(ApiResponse<WatchDto>.ErrorResponse("ID mismatch"));

            var validationResult = await _updateValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                return BadRequest(ApiResponse<WatchDto>.ErrorResponse(
                    "Validation failed",
                    validationResult.Errors.Select(e => e.ErrorMessage).ToList()));
            }

            var result = await _watchService.UpdateAsync(dto);
            return HandleResponse(result);
        }

        /// <summary>
        /// Delete watch (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _watchService.DeleteAsync(id);
            return HandleResponse(result);
        }
    }
}
