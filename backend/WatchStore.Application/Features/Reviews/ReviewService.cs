using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Enums;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Reviews
{
  public class ReviewService : BaseService, IReviewService
  {
    private readonly IRepository<Review> _reviewRepository;
    private readonly IRepository<Watch> _watchRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<OrderItem> _orderItemRepository;

    public ReviewService(
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<ReviewService> logger) : base(unitOfWork, cache, logger)
    {
      _reviewRepository = unitOfWork.GetRepository<Review>();
      _watchRepository = unitOfWork.GetRepository<Watch>();
      _userRepository = unitOfWork.GetRepository<User>();
      _orderItemRepository = unitOfWork.GetRepository<OrderItem>();
    }

    public async Task<ApiResponse<ReviewDto>> CreateReviewAsync(int userId, CreateReviewDto dto)
    {
      try
      {
        Logger.LogInformation("Creating review for watch {WatchId} by user {UserId}", dto.WatchId, userId);

        // Check if watch exists
        var watch = await _watchRepository.GetByIdAsync(dto.WatchId);
        if (watch == null)
        {
          return ApiResponse<ReviewDto>.ErrorResponse("Sản phẩm không tồn tại");
        }

        // Check if user exists
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
          return ApiResponse<ReviewDto>.ErrorResponse("Người dùng không tồn tại");
        }

        // Check if user already reviewed this product
        var existingReview = await _reviewRepository.GetQueryable()
            .AnyAsync(r => r.UserId == userId && r.WatchId == dto.WatchId);

        if (existingReview)
        {
          return ApiResponse<ReviewDto>.ErrorResponse("Bạn đã đánh giá sản phẩm này rồi");
        }

        // Validate rating
        if (dto.Rating < 1 || dto.Rating > 5)
        {
          return ApiResponse<ReviewDto>.ErrorResponse("Đánh giá phải từ 1 đến 5 sao");
        }

        // Check if user has purchased this product
        var hasPurchased = await _orderItemRepository.GetQueryable()
            .AnyAsync(oi =>
                oi.Order.UserId == userId &&
                oi.WatchId == dto.WatchId &&
                oi.Order.Status == OrderStatus.Delivered);

        var review = new Review
        {
          WatchId = dto.WatchId,
          UserId = userId,
          Rating = dto.Rating,
          Title = dto.Title,
          Content = dto.Content,
          IsVerified = hasPurchased,
          HelpfulCount = 0
        };

        await _reviewRepository.AddAsync(review);
        await UnitOfWork.SaveChangesAsync();

        // Reload with navigation properties
        review = await _reviewRepository.GetQueryable()
            .Include(r => r.Watch)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == review.Id);

        var reviewDto = new ReviewDto
        {
          Id = review.Id,
          WatchId = review.WatchId,
          WatchName = review.Watch.Name,
          UserId = review.UserId,
          UserName = review.User.FullName,
          Rating = review.Rating,
          Title = review.Title,
          Content = review.Content,
          IsVerified = review.IsVerified,
          HelpfulCount = review.HelpfulCount,
          CreatedAt = review.CreatedAt
        };

        Logger.LogInformation("Review created successfully with ID {ReviewId}", review.Id);
        return ApiResponse<ReviewDto>.SuccessResponse(reviewDto, "Đánh giá của bạn đã được gửi thành công");
      }
      catch (Exception ex)
      {
        Logger.LogError(ex, "Error creating review");
        return ApiResponse<ReviewDto>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<ReviewDto>> UpdateReviewAsync(int userId, int reviewId, UpdateReviewDto dto)
    {
      try
      {
        Logger.LogInformation("Updating review {ReviewId} by user {UserId}", reviewId, userId);

        var review = await _reviewRepository.GetByIdAsync(reviewId);
        if (review == null)
        {
          return ApiResponse<ReviewDto>.ErrorResponse("Đánh giá không tồn tại");
        }

        // Check if user owns this review
        if (review.UserId != userId)
        {
          return ApiResponse<ReviewDto>.ErrorResponse("Bạn không có quyền chỉnh sửa đánh giá này");
        }

        // Validate rating
        if (dto.Rating < 1 || dto.Rating > 5)
        {
          return ApiResponse<ReviewDto>.ErrorResponse("Đánh giá phải từ 1 đến 5 sao");
        }

        review.Rating = dto.Rating;
        review.Title = dto.Title;
        review.Content = dto.Content;

        await _reviewRepository.UpdateAsync(review);
        await UnitOfWork.SaveChangesAsync();

        // Reload with navigation properties
        review = await _reviewRepository.GetQueryable()
            .Include(r => r.Watch)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == review.Id);

        var reviewDto = new ReviewDto
        {
          Id = review.Id,
          WatchId = review.WatchId,
          WatchName = review.Watch.Name,
          UserId = review.UserId,
          UserName = review.User.FullName,
          Rating = review.Rating,
          Title = review.Title,
          Content = review.Content,
          IsVerified = review.IsVerified,
          HelpfulCount = review.HelpfulCount,
          CreatedAt = review.CreatedAt
        };

        Logger.LogInformation("Review {ReviewId} updated successfully", reviewId);
        return ApiResponse<ReviewDto>.SuccessResponse(reviewDto, "Đánh giá đã được cập nhật");
      }
      catch (Exception ex)
      {
        Logger.LogError(ex, "Error updating review {ReviewId}", reviewId);
        return ApiResponse<ReviewDto>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<bool>> DeleteReviewAsync(int userId, int reviewId)
    {
      try
      {
        Logger.LogInformation("Deleting review {ReviewId} by user {UserId}", reviewId, userId);

        var review = await _reviewRepository.GetByIdAsync(reviewId);
        if (review == null)
        {
          return ApiResponse<bool>.ErrorResponse("Đánh giá không tồn tại");
        }

        // Check if user owns this review
        if (review.UserId != userId)
        {
          return ApiResponse<bool>.ErrorResponse("Bạn không có quyền xóa đánh giá này");
        }

        await _reviewRepository.DeleteAsync(review);
        await UnitOfWork.SaveChangesAsync();

        Logger.LogInformation("Review {ReviewId} deleted successfully", reviewId);
        return ApiResponse<bool>.SuccessResponse(true, "Đánh giá đã được xóa");
      }
      catch (Exception ex)
      {
        Logger.LogError(ex, "Error deleting review {ReviewId}", reviewId);
        return ApiResponse<bool>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<ReviewDto>> GetReviewByIdAsync(int reviewId)
    {
      try
      {
        var review = await _reviewRepository.GetQueryable()
            .Include(r => r.User)
            .Include(r => r.Watch)
            .FirstOrDefaultAsync(r => r.Id == reviewId);

        if (review == null)
        {
          return ApiResponse<ReviewDto>.ErrorResponse("Đánh giá không tồn tại");
        }

        var reviewDto = new ReviewDto
        {
          Id = review.Id,
          WatchId = review.WatchId,
          WatchName = review.Watch.Name,
          UserId = review.UserId,
          UserName = review.User.FullName,
          Rating = review.Rating,
          Title = review.Title,
          Content = review.Content,
          IsVerified = review.IsVerified,
          HelpfulCount = review.HelpfulCount,
          CreatedAt = review.CreatedAt
        };

        return ApiResponse<ReviewDto>.SuccessResponse(reviewDto);
      }
      catch (Exception ex)
      {
        Logger.LogError(ex, "Error getting review {ReviewId}", reviewId);
        return ApiResponse<ReviewDto>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<PagedResponse<ReviewDto>>> GetReviewsByWatchIdAsync(int watchId, PaginationParams pagination)
    {
      try
      {
        Logger.LogInformation("Getting reviews for watch {WatchId}", watchId);

        var watch = await _watchRepository.GetByIdAsync(watchId);
        if (watch == null)
        {
          return ApiResponse<PagedResponse<ReviewDto>>.ErrorResponse("Sản phẩm không tồn tại");
        }

        var query = _reviewRepository.GetQueryable()
            .Include(r => r.User)
            .Include(r => r.Watch)
            .Where(r => r.WatchId == watchId)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();
        var reviews = await query
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync();

        var reviewDtos = reviews.Select(r => new ReviewDto
        {
          Id = r.Id,
          WatchId = r.WatchId,
          WatchName = r.Watch.Name,
          UserId = r.UserId,
          UserName = r.User.FullName,
          Rating = r.Rating,
          Title = r.Title,
          Content = r.Content,
          IsVerified = r.IsVerified,
          HelpfulCount = r.HelpfulCount,
          CreatedAt = r.CreatedAt
        }).ToList();

        var result = new PagedResponse<ReviewDto>
        {
          Items = reviewDtos,
          TotalRecords = totalCount,
          PageNumber = pagination.PageNumber,
          PageSize = pagination.PageSize,
          TotalPages = (int)Math.Ceiling(totalCount / (double)pagination.PageSize)
        };

        return ApiResponse<PagedResponse<ReviewDto>>.SuccessResponse(result);
      }
      catch (Exception ex)
      {
        Logger.LogError(ex, "Error getting reviews for watch {WatchId}", watchId);
        return ApiResponse<PagedResponse<ReviewDto>>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<PagedResponse<ReviewDto>>> GetReviewsByUserIdAsync(int userId, PaginationParams pagination)
    {
      try
      {
        Logger.LogInformation("Getting reviews by user {UserId}", userId);

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
          return ApiResponse<PagedResponse<ReviewDto>>.ErrorResponse("Người dùng không tồn tại");
        }

        var query = _reviewRepository.GetQueryable()
            .Include(r => r.User)
            .Include(r => r.Watch)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();
        var reviews = await query
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync();

        var reviewDtos = reviews.Select(r => new ReviewDto
        {
          Id = r.Id,
          WatchId = r.WatchId,
          WatchName = r.Watch.Name,
          UserId = r.UserId,
          UserName = r.User.FullName,
          Rating = r.Rating,
          Title = r.Title,
          Content = r.Content,
          IsVerified = r.IsVerified,
          HelpfulCount = r.HelpfulCount,
          CreatedAt = r.CreatedAt
        }).ToList();

        var result = new PagedResponse<ReviewDto>
        {
          Items = reviewDtos,
          TotalRecords = totalCount,
          PageNumber = pagination.PageNumber,
          PageSize = pagination.PageSize,
          TotalPages = (int)Math.Ceiling(totalCount / (double)pagination.PageSize)
        };

        return ApiResponse<PagedResponse<ReviewDto>>.SuccessResponse(result);
      }
      catch (Exception ex)
      {
        Logger.LogError(ex, "Error getting reviews by user {UserId}", userId);
        return ApiResponse<PagedResponse<ReviewDto>>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<PagedResponse<ReviewDto>>> GetAllReviewsAsync(ReviewAdminFilterDto filter, PaginationParams pagination)
    {
      try
      {
        Logger.LogInformation("Getting all reviews for admin with filters");

        var query = _reviewRepository.GetQueryable()
            .Include(r => r.User)
            .Include(r => r.Watch)
            .AsQueryable();

        if (filter.WatchId.HasValue)
        {
          query = query.Where(r => r.WatchId == filter.WatchId.Value);
        }

        if (filter.UserId.HasValue)
        {
          query = query.Where(r => r.UserId == filter.UserId.Value);
        }

        if (filter.MinRating.HasValue)
        {
          query = query.Where(r => r.Rating >= filter.MinRating.Value);
        }

        if (filter.MaxRating.HasValue)
        {
          query = query.Where(r => r.Rating <= filter.MaxRating.Value);
        }

        if (filter.IsVerified.HasValue)
        {
          query = query.Where(r => r.IsVerified == filter.IsVerified.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
          var term = filter.SearchTerm.ToLower();
          query = query.Where(r =>
              r.Title.ToLower().Contains(term) ||
              r.Content.ToLower().Contains(term) ||
              r.User.FullName.ToLower().Contains(term) ||
              r.Watch.Name.ToLower().Contains(term));
        }

        if (filter.FromDate.HasValue)
        {
          query = query.Where(r => r.CreatedAt >= filter.FromDate.Value);
        }

        if (filter.ToDate.HasValue)
        {
          query = query.Where(r => r.CreatedAt <= filter.ToDate.Value);
        }

        query = query.OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();
        var reviews = await query
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync();

        var reviewDtos = reviews.Select(r => new ReviewDto
        {
          Id = r.Id,
          WatchId = r.WatchId,
          WatchName = r.Watch.Name,
          UserId = r.UserId,
          UserName = r.User.FullName,
          Rating = r.Rating,
          Title = r.Title,
          Content = r.Content,
          IsVerified = r.IsVerified,
          HelpfulCount = r.HelpfulCount,
          CreatedAt = r.CreatedAt
        }).ToList();

        var result = new PagedResponse<ReviewDto>
        {
          Items = reviewDtos,
          TotalRecords = totalCount,
          PageNumber = pagination.PageNumber,
          PageSize = pagination.PageSize,
          TotalPages = (int)Math.Ceiling(totalCount / (double)pagination.PageSize)
        };

        return ApiResponse<PagedResponse<ReviewDto>>.SuccessResponse(result);
      }
      catch (Exception ex)
      {
        Logger.LogError(ex, "Error getting admin review list");
        return ApiResponse<PagedResponse<ReviewDto>>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<bool>> AdminDeleteReviewAsync(int reviewId)
    {
      try
      {
        Logger.LogInformation("Admin deleting review {ReviewId}", reviewId);

        var review = await _reviewRepository.GetByIdAsync(reviewId);
        if (review == null)
        {
          return ApiResponse<bool>.ErrorResponse("Đánh giá không tồn tại");
        }

        await _reviewRepository.DeleteAsync(review);
        await UnitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Đánh giá đã được xóa");
      }
      catch (Exception ex)
      {
        Logger.LogError(ex, "Error admin deleting review {ReviewId}", reviewId);
        return ApiResponse<bool>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<ReviewSummaryDto>> GetReviewSummaryAsync(int watchId)
    {
      try
      {
        var reviews = await _reviewRepository.GetQueryable()
            .Where(r => r.WatchId == watchId)
            .ToListAsync();

        if (!reviews.Any())
        {
          return ApiResponse<ReviewSummaryDto>.SuccessResponse(new ReviewSummaryDto
          {
            TotalReviews = 0,
            AverageRating = 0,
            RatingDistribution = new Dictionary<int, int>
                        {
                            { 1, 0 }, { 2, 0 }, { 3, 0 }, { 4, 0 }, { 5, 0 }
                        }
          });
        }

        var totalReviews = reviews.Count;
        var averageRating = reviews.Average(r => r.Rating);
        var ratingDistribution = new Dictionary<int, int>();

        for (int i = 1; i <= 5; i++)
        {
          ratingDistribution[i] = reviews.Count(r => r.Rating == i);
        }

        var summary = new ReviewSummaryDto
        {
          TotalReviews = totalReviews,
          AverageRating = Math.Round(averageRating, 1),
          RatingDistribution = ratingDistribution
        };

        return ApiResponse<ReviewSummaryDto>.SuccessResponse(summary);
      }
      catch (Exception ex)
      {
        Logger.LogError(ex, "Error getting review summary for watch {WatchId}", watchId);
        return ApiResponse<ReviewSummaryDto>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }

    public async Task<ApiResponse<bool>> MarkReviewHelpfulAsync(int reviewId)
    {
      try
      {
        Logger.LogInformation("Marking review {ReviewId} as helpful", reviewId);

        var review = await _reviewRepository.GetByIdAsync(reviewId);
        if (review == null)
        {
          return ApiResponse<bool>.ErrorResponse("Đánh giá không tồn tại");
        }

        review.HelpfulCount++;
        await _reviewRepository.UpdateAsync(review);
        await UnitOfWork.SaveChangesAsync();

        Logger.LogInformation("Review {ReviewId} marked as helpful", reviewId);
        return ApiResponse<bool>.SuccessResponse(true, "Cảm ơn phản hồi của bạn");
      }
      catch (Exception ex)
      {
        Logger.LogError(ex, "Error marking review {ReviewId} as helpful", reviewId);
        return ApiResponse<bool>.ErrorResponse($"Lỗi: {ex.Message}");
      }
    }
  }
}
