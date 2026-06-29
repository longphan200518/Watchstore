using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Notifications
{
    public class NotificationService : INotificationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRepository<Notification> _repo;

        public NotificationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _repo = _unitOfWork.GetRepository<Notification>();
        }

        public async Task<ApiResponse<PagedResponse<NotificationDto>>> GetUserNotificationsAsync(int userId, PaginationParams pagination)
        {
            var query = _repo.GetQueryable()
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt);

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)pagination.PageSize);

            var items = await query
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Message = n.Message,
                    IsRead = n.IsRead,
                    Type = n.Type,
                    ReferenceUrl = n.ReferenceUrl,
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();

            var response = new PagedResponse<NotificationDto>
            {
                Items = items,
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize,
                TotalPages = totalPages,
                TotalRecords = total
            };

            return ApiResponse<PagedResponse<NotificationDto>>.SuccessResponse(response);
        }

        public async Task<ApiResponse<int>> GetUnreadCountAsync(int userId)
        {
            var count = await _repo.GetQueryable()
                .Where(n => n.UserId == userId && !n.IsRead)
                .CountAsync();

            return ApiResponse<int>.SuccessResponse(count);
        }

        public async Task<ApiResponse<bool>> MarkAsReadAsync(int notificationId, int userId)
        {
            var notification = await _repo.GetByIdAsync(notificationId);
            if (notification == null || notification.UserId != userId)
                return ApiResponse<bool>.ErrorResponse("Không tìm thấy thông báo");

            notification.IsRead = true;
            await _repo.UpdateAsync(notification);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<bool>> MarkAllAsReadAsync(int userId)
        {
            var unreadNotifications = await _repo.GetQueryable()
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            if (!unreadNotifications.Any())
                return ApiResponse<bool>.SuccessResponse(true);

            foreach (var n in unreadNotifications)
            {
                n.IsRead = true;
                await _repo.UpdateAsync(n); // Hoặc viết query update trực tiếp nếu Repo hỗ trợ UpdateRange
            }

            await _unitOfWork.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<bool>> CreateNotificationAsync(int userId, string title, string message, string type, string? referenceUrl = null)
        {
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = type,
                ReferenceUrl = referenceUrl,
                IsRead = false
            };

            await _repo.AddAsync(notification);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true);
        }
    }
}
