using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResponse<NotificationDto>>>> GetMyNotifications([FromQuery] PaginationParams pagination)
        {
            var userId = GetUserId();
            var response = await _notificationService.GetUserNotificationsAsync(userId, pagination);
            return Ok(response);
        }

        [HttpGet("unread-count")]
        public async Task<ActionResult<ApiResponse<int>>> GetUnreadCount()
        {
            var userId = GetUserId();
            var response = await _notificationService.GetUnreadCountAsync(userId);
            return Ok(response);
        }

        [HttpPut("{id}/read")]
        public async Task<ActionResult<ApiResponse<bool>>> MarkAsRead(int id)
        {
            var userId = GetUserId();
            var response = await _notificationService.MarkAsReadAsync(id, userId);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }

        [HttpPut("read-all")]
        public async Task<ActionResult<ApiResponse<bool>>> MarkAllAsRead()
        {
            var userId = GetUserId();
            var response = await _notificationService.MarkAllAsReadAsync(userId);
            return Ok(response);
        }
    }
}
