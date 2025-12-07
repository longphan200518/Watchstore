using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Enums;

namespace WatchStore.API.Controllers.Admin
{
  [ApiController]
  [Route("api/admin/orders")]
  [Authorize(Roles = "Admin")]
  [ApiExplorerSettings(GroupName = "admin")]
  public class AdminOrdersController : ControllerBase
  {
    private readonly IOrderService _orderService;

    public AdminOrdersController(IOrderService orderService)
    {
      _orderService = orderService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<OrderDto>>), 200)]
    public async Task<IActionResult> GetAll([FromQuery] PaginationParams pagination)
    {
      var result = await _orderService.GetAllOrdersAsync(pagination);
      return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<OrderDto>), 200)]
    public async Task<IActionResult> GetById(int id)
    {
      var result = await _orderService.GetByIdAsync(id);
      return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPatch("{id}/status")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
      var result = await _orderService.UpdateStatusAsync(id, dto.Status);
      return result.Success ? Ok(result) : BadRequest(result);
    }
  }

  public class UpdateStatusDto
  {
    public OrderStatus Status { get; set; }
  }
}
