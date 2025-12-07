using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Enums;

namespace WatchStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [ApiExplorerSettings(GroupName = "user")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Create new order (Authenticated users)
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<OrderDto>), 201)]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _orderService.CreateAsync(dto, userId);

            return result.Success
                ? CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result)
                : BadRequest(result);
        }

        /// <summary>
        /// Get my orders (Authenticated user)
        /// </summary>
        [HttpGet("my-orders")]
        [ProducesResponseType(typeof(ApiResponse<PagedResponse<OrderDto>>), 200)]
        public async Task<IActionResult> GetMyOrders([FromQuery] PaginationParams pagination)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _orderService.GetUserOrdersAsync(userId, pagination);
            return Ok(result);
        }

        /// <summary>
        /// Get order by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<OrderDto>), 200)]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var isAdmin = User.IsInRole("Admin");

            var result = isAdmin
                ? await _orderService.GetByIdAsync(id)
                : await _orderService.GetByIdAsync(id, userId);

            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>
        /// Cancel order (Order owner only, pending orders only)
        /// </summary>
        [HttpPost("{id}/cancel")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> Cancel(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _orderService.CancelOrderAsync(id, userId);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
