using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [ApiExplorerSettings(GroupName = "user")]
  public class CartController : ControllerBase
  {
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
      _cartService = cartService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
      var userId = User.Identity?.IsAuthenticated == true
          ? int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
          : (int?)null;

      var result = await _cartService.GetCartAsync(userId);
      return Ok(result);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddCartItemDto dto)
    {
      var userId = User.Identity?.IsAuthenticated == true
          ? int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
          : (int?)null;

      var result = await _cartService.AddItemAsync(dto, userId);
      return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("items")]
    public async Task<IActionResult> UpdateItem([FromBody] UpdateCartItemDto dto)
    {
      var userId = User.Identity?.IsAuthenticated == true
          ? int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
          : (int?)null;

      var result = await _cartService.UpdateItemAsync(dto, userId);
      return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("items/{watchId}")]
    public async Task<IActionResult> RemoveItem(int watchId)
    {
      var userId = User.Identity?.IsAuthenticated == true
          ? int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
          : (int?)null;

      var result = await _cartService.RemoveItemAsync(watchId, userId);
      return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
      var userId = User.Identity?.IsAuthenticated == true
          ? int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
          : (int?)null;

      var result = await _cartService.ClearCartAsync(userId);
      return Ok(result);
    }
  }
}