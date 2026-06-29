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

    public class RevenueByCategoryDto
    {
        public string CategoryName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int Quantity { get; set; }
    }

    public class RevenueByRegionDto
    {
        public string Province { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int OrderCount { get; set; }
    }

    public class RevenueByChannelDto
    {
        public string ChannelName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int OrderCount { get; set; }
    }

    public class RevenuePointGroupDto
    {
        public string Period { get; set; } = string.Empty; // Format: YYYY-MM, YYYY-QQ, YYYY
        public decimal Revenue { get; set; }
    }

    public class DashboardSummaryDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public decimal AverageOrderValue { get; set; }
        public double ConversionRate { get; set; }
        public List<OrderStatusCountDto> OrdersByStatus { get; set; } = new();
        public List<RevenuePointDto> RevenueByDate { get; set; } = new();
        
        // Advanced Analytics
        public List<RevenuePointGroupDto> RevenueByMonth { get; set; } = new();
        public List<RevenuePointGroupDto> RevenueByQuarter { get; set; } = new();
        public List<RevenuePointGroupDto> RevenueByYear { get; set; } = new();
        public List<RevenueByCategoryDto> RevenueByCategory { get; set; } = new();
        public List<RevenueByRegionDto> RevenueByRegion { get; set; } = new();
        public List<RevenueByChannelDto> RevenueByChannel { get; set; } = new();
        
        public List<TopProductDto> TopProducts { get; set; } = new();
    }
}
