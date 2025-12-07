using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers.Admin
{
  [ApiController]
  [Route("api/admin/brands")]
  [Authorize(Roles = "Admin")]
  [ApiExplorerSettings(GroupName = "admin")]
  public class AdminBrandsController : ControllerBase
  {
    private readonly IBrandService _brandService;

    public AdminBrandsController(IBrandService brandService)
    {
      _brandService = brandService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<BrandDto>>), 200)]
    public async Task<IActionResult> GetAll([FromQuery] PaginationParams pagination)
    {
      var result = await _brandService.GetAllAsync(pagination);
      return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<BrandDto>), 200)]
    public async Task<IActionResult> GetById(int id)
    {
      var result = await _brandService.GetByIdAsync(id);
      return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<BrandDto>), 201)]
    public async Task<IActionResult> Create([FromBody] CreateBrandDto dto)
    {
      var result = await _brandService.CreateAsync(dto);
      return result.Success
          ? CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result)
          : BadRequest(result);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<BrandDto>), 200)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBrandDto dto)
    {
      if (id != dto.Id)
        return BadRequest(ApiResponse<BrandDto>.ErrorResponse("ID mismatch"));

      var result = await _brandService.UpdateAsync(dto);
      return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _brandService.DeleteAsync(id);
      return result.Success ? Ok(result) : NotFound(result);
    }
  }
}
