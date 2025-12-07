using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
  public interface IReviewService
  {
    Task<ApiResponse<ReviewDto>> CreateReviewAsync(int userId, CreateReviewDto dto);
    Task<ApiResponse<ReviewDto>> UpdateReviewAsync(int userId, int reviewId, UpdateReviewDto dto);
    Task<ApiResponse<bool>> DeleteReviewAsync(int userId, int reviewId);
    Task<ApiResponse<ReviewDto>> GetReviewByIdAsync(int reviewId);
    Task<ApiResponse<PagedResponse<ReviewDto>>> GetReviewsByWatchIdAsync(int watchId, PaginationParams pagination);
    Task<ApiResponse<PagedResponse<ReviewDto>>> GetReviewsByUserIdAsync(int userId, PaginationParams pagination);
    Task<ApiResponse<ReviewSummaryDto>> GetReviewSummaryAsync(int watchId);
    Task<ApiResponse<bool>> MarkReviewHelpfulAsync(int reviewId);
  }
}
