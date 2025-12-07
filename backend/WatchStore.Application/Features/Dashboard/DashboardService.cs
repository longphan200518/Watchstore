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

    public DashboardService(IUnitOfWork unitOfWork, Microsoft.Extensions.Caching.Memory.IMemoryCache cache, Microsoft.Extensions.Logging.ILogger<DashboardService> logger)
        : base(unitOfWork, cache, logger)
    {
      _orderRepository = unitOfWork.GetRepository<Order>();
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

        var deliveredQuery = query.Where(o => o.Status == OrderStatus.Delivered);

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

        var summary = new DashboardSummaryDto
        {
          TotalRevenue = totalRevenue,
          TotalOrders = totalOrders,
          OrdersByStatus = statusCounts,
          RevenueByDate = revenueByDate,
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
