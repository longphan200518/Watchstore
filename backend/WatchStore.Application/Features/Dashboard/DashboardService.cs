using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Enums;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Dashboard
{
    public class DashboardService : BaseService, IDashboardService
    {
        private readonly IRepository<Order> _orderRepository;

        public DashboardService(IServiceFacade facade)
            : base(facade, facade.GetLogger<DashboardService>())
        {
            _orderRepository = facade.UnitOfWork.GetRepository<Order>();
        }

        public async Task<ApiResponse<DashboardSummaryDto>> GetSummaryAsync(DashboardFilterDto filter)
        {
            try
            {
                IQueryable<Order> query = _orderRepository.GetQueryable();

                query = query
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Watch);

                if (filter.FromDate.HasValue)
                {
                    query = query.Where(o => o.CreatedAt >= filter.FromDate.Value);
                }

                if (filter.ToDate.HasValue)
                {
                    var to = filter.ToDate.Value.Date.AddDays(1).AddTicks(-1);
                    query = query.Where(o => o.CreatedAt <= to);
                }

                var totalOrders = await query.CountAsync();

                var statusCounts = await query
                    .GroupBy(o => o.Status)
                    .Select(g => new OrderStatusCountDto
                    {
                        Status = g.Key,
                        Count = g.Count()
                    })
                    .ToListAsync();

                var deliveredQuery = query.Where(o => o.Status == OrderStatus.Delivered || o.Status == OrderStatus.Shipped);

                var totalRevenue = await deliveredQuery
                    .SelectMany(o => o.OrderItems)
                    .SumAsync(oi => oi.Price * oi.Quantity);

                var revenueByDate = await deliveredQuery
                    .GroupBy(o => o.CreatedAt.Date)
                    .Select(g => new RevenuePointDto
                    {
                        Date = g.Key,
                        Revenue = g.Sum(o => o.OrderItems.Sum(oi => oi.Price * oi.Quantity))
                    })
                    .OrderBy(p => p.Date)
                    .ToListAsync();

                var topProducts = await deliveredQuery
                    .SelectMany(o => o.OrderItems)
                    .GroupBy(oi => new { oi.WatchId, oi.Watch.Name })
                    .Select(g => new TopProductDto
                    {
                        WatchId = g.Key.WatchId,
                        WatchName = g.Key.Name,
                        Quantity = g.Sum(x => x.Quantity),
                        Revenue = g.Sum(x => x.Price * x.Quantity)
                    })
                    .OrderByDescending(p => p.Revenue)
                    .Take(filter.TopProducts <= 0 ? 5 : filter.TopProducts)
                    .ToListAsync();

                var rawMonth = await deliveredQuery
                    .Select(o => new { o.CreatedAt.Year, o.CreatedAt.Month, Total = o.OrderItems.Sum(oi => oi.Price * oi.Quantity) })
                    .ToListAsync();

                var revenueByMonth = rawMonth
                    .GroupBy(x => new { x.Year, x.Month })
                    .Select(g => new RevenuePointGroupDto
                    {
                        Period = $"{g.Key.Year}-{g.Key.Month:D2}",
                        Revenue = g.Sum(x => x.Total)
                    })
                    .OrderBy(p => p.Period)
                    .ToList();

                var revenueByQuarter = rawMonth
                    .GroupBy(x => new { x.Year, Quarter = (x.Month - 1) / 3 + 1 })
                    .Select(g => new RevenuePointGroupDto
                    {
                        Period = $"{g.Key.Year}-Q{g.Key.Quarter}",
                        Revenue = g.Sum(x => x.Total)
                    })
                    .OrderBy(p => p.Period)
                    .ToList();

                var revenueByYear = rawMonth
                    .GroupBy(x => x.Year)
                    .Select(g => new RevenuePointGroupDto
                    {
                        Period = $"{g.Key}",
                        Revenue = g.Sum(x => x.Total)
                    })
                    .OrderBy(p => p.Period)
                    .ToList();

                var revenueByCategoryRaw = await deliveredQuery
                    .SelectMany(o => o.OrderItems)
                    .Select(oi => new { CategoryName = oi.Watch.Category.Name, oi.Price, oi.Quantity })
                    .ToListAsync();

                var revenueByCategory = revenueByCategoryRaw
                    .GroupBy(x => x.CategoryName)
                    .Select(g => new RevenueByCategoryDto
                    {
                        CategoryName = g.Key ?? "Unknown",
                        Revenue = g.Sum(x => x.Price * x.Quantity),
                        Quantity = g.Sum(x => x.Quantity)
                    })
                    .OrderByDescending(x => x.Revenue)
                    .ToList();

                var rawChannels = await deliveredQuery
                    .Select(o => new { o.Source, Total = o.OrderItems.Sum(oi => oi.Price * oi.Quantity) })
                    .ToListAsync();

                var revenueByChannel = rawChannels
                    .GroupBy(x => x.Source)
                    .Select(g => new RevenueByChannelDto
                    {
                        ChannelName = g.Key.ToString(),
                        Revenue = g.Sum(x => x.Total),
                        OrderCount = g.Count()
                    })
                    .ToList();
                    
                var rawRegions = await deliveredQuery
                    .Select(o => new { o.ShippingAddress, Total = o.OrderItems.Sum(oi => oi.Price * oi.Quantity) })
                    .ToListAsync();

                var revenueByRegion = rawRegions
                    .GroupBy(x => 
                    {
                        // Giả sử địa chỉ cuối cùng sau dấu phẩy là tỉnh thành phố
                        var parts = x.ShippingAddress?.Split(',');
                        return parts != null && parts.Length > 0 ? parts.Last().Trim() : "Unknown";
                    })
                    .Select(g => new RevenueByRegionDto
                    {
                        Province = g.Key,
                        Revenue = g.Sum(x => x.Total),
                        OrderCount = g.Count()
                    })
                    .OrderByDescending(x => x.Revenue)
                    .ToList();

                var summary = new DashboardSummaryDto
                {
                    TotalRevenue = totalRevenue,
                    TotalOrders = totalOrders,
                    AverageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0,
                    ConversionRate = totalOrders > 0 ? Math.Round(2.0 + (totalOrders % 5) * 0.5, 2) : 0, // Mock data
                    OrdersByStatus = statusCounts,
                    RevenueByDate = revenueByDate,
                    RevenueByMonth = revenueByMonth,
                    RevenueByQuarter = revenueByQuarter,
                    RevenueByYear = revenueByYear,
                    RevenueByCategory = revenueByCategory,
                    RevenueByRegion = revenueByRegion,
                    RevenueByChannel = revenueByChannel,
                    TopProducts = topProducts
                };

                return ApiResponse<DashboardSummaryDto>.SuccessResponse(summary);
            }
            catch (Exception ex)
            {
                return LogAndReturnError<DashboardSummaryDto>("Error loading dashboard", ex);
            }
        }
    }
}
