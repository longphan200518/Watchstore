namespace WatchStore.Application.DTOs
{
  // Request DTO for creating review
  public class CreateReviewDto
  {
    public int WatchId { get; set; }
    public int Rating { get; set; } // 1-5
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
  }

  // Request DTO for updating review
  public class UpdateReviewDto
  {
    public int Rating { get; set; } // 1-5
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
  }

  // Response DTO for review
  public class ReviewDto
  {
    public int Id { get; set; }
    public int WatchId { get; set; }
    public string WatchName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
    public int HelpfulCount { get; set; }
    public DateTime CreatedAt { get; set; }
  }

  // Admin-side filtering for reviews
  public class ReviewAdminFilterDto
  {
    public int? WatchId { get; set; }
    public int? UserId { get; set; }
    public int? MinRating { get; set; }
    public int? MaxRating { get; set; }
    public bool? IsVerified { get; set; }
    public string? SearchTerm { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
  }

  // Summary DTO for watch ratings
  public class ReviewSummaryDto
  {
    public int TotalReviews { get; set; }
    public double AverageRating { get; set; }
    public Dictionary<int, int> RatingDistribution { get; set; } = new();
  }
}
