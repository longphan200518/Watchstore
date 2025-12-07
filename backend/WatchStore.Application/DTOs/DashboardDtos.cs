using WatchStore.Domain.Enums;

namespace WatchStore.Application.DTOs
{
  public class DashboardFilterDto
  {
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int TopProducts { get; set; } = 5;
  }

  public class OrderStatusCountDto
  {
    public OrderStatus Status { get; set; }
    public int Count { get; set; }
  }

  public class RevenuePointDto
  {
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
  }

  public class TopProductDto
  {
    public int WatchId { get; set; }
    public string WatchName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Revenue { get; set; }
  }

  public class DashboardSummaryDto
  {
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public List<OrderStatusCountDto> OrdersByStatus { get; set; } = new();
    public List<RevenuePointDto> RevenueByDate { get; set; } = new();
    public List<TopProductDto> TopProducts { get; set; } = new();
  }
}
