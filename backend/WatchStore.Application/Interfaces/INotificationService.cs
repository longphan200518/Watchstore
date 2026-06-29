using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
    public interface INotificationService
    {
        Task<ApiResponse<PagedResponse<NotificationDto>>> GetUserNotificationsAsync(int userId, PaginationParams pagination);
        Task<ApiResponse<int>> GetUnreadCountAsync(int userId);
        Task<ApiResponse<bool>> MarkAsReadAsync(int notificationId, int userId);
        Task<ApiResponse<bool>> MarkAllAsReadAsync(int userId);
        Task<ApiResponse<bool>> CreateNotificationAsync(int userId, string title, string message, string type, string? referenceUrl = null);
    }
}
