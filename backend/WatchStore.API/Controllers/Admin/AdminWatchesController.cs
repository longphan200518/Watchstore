using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers.Admin
{
  [ApiController]
  [Route("api/admin/watches")]
  [Authorize(Roles = "Admin")]
  [ApiExplorerSettings(GroupName = "admin")]
  public class AdminWatchesController : ControllerBase
  {
    private readonly IWatchService _watchService;
    private readonly IValidator<CreateWatchDto> _createValidator;
    private readonly IValidator<UpdateWatchDto> _updateValidator;

    public AdminWatchesController(
        IWatchService watchService,
        IValidator<CreateWatchDto> createValidator,
        IValidator<UpdateWatchDto> updateValidator)
    {
      _watchService = watchService;
      _createValidator = createValidator;
      _updateValidator = updateValidator;
    }

    /// <summary>
    /// Get all watches with filters and pagination (Admin)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<WatchDto>>), 200)]
    public async Task<IActionResult> GetAll([FromQuery] WatchFilterDto filter, [FromQuery] PaginationParams pagination)
    {
      var result = await _watchService.GetAllAsync(filter, pagination);
      return Ok(result);
    }

    /// <summary>
    /// Get watch by ID (Admin)
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<WatchDto>), 200)]
    public async Task<IActionResult> GetById(int id)
    {
      var result = await _watchService.GetByIdAsync(id);
      return result.Success ? Ok(result) : NotFound(result);
    }

    /// <summary>
    /// Create new watch (Admin)
    /// </summary>
    [HttpPost]
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

      var result = await _watchService.CreateAsync(dto, null);
      return result.Success
          ? CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result)
          : BadRequest(result);
    }

    /// <summary>
    /// Update watch (Admin)
    /// </summary>
    [HttpPut("{id}")]
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
      return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Delete watch (Admin)
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _watchService.DeleteAsync(id);
      return result.Success ? Ok(result) : NotFound(result);
    }

  }
}
