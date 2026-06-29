using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Enums;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Exports
{
    public class ExportService : IExportService
    {
        private readonly IRepository<Order> _orderRepository;

        public ExportService(IRepository<Order> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<byte[]> ExportOrdersToExcelAsync(DateTime? startDate, DateTime? endDate)
        {
            var query = _orderRepository.GetQueryable()
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Watch)
                .AsNoTracking()
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(o => o.CreatedAt >= startDate.Value);
            
            if (endDate.HasValue)
                query = query.Where(o => o.CreatedAt <= endDate.Value);

            var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Orders");

            // Headers
            worksheet.Cell(1, 1).Value = "Mã Đơn";
            worksheet.Cell(1, 2).Value = "Ngày Đặt";
            worksheet.Cell(1, 3).Value = "Khách Hàng";
            worksheet.Cell(1, 4).Value = "Số Điện Thoại";
            worksheet.Cell(1, 5).Value = "Địa Chỉ";
            worksheet.Cell(1, 6).Value = "Tổng Tiền (VND)";
            worksheet.Cell(1, 7).Value = "Phí Vận Chuyển";
            worksheet.Cell(1, 8).Value = "Trạng Thái";
            worksheet.Cell(1, 9).Value = "Nguồn";
            worksheet.Cell(1, 10).Value = "Sản Phẩm";

            // Format Header
            var headerRow = worksheet.Row(1);
            headerRow.Style.Font.Bold = true;
            headerRow.Style.Fill.BackgroundColor = XLColor.LightGray;
            headerRow.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            // Data
            int row = 2;
            foreach (var order in orders)
            {
                worksheet.Cell(row, 1).Value = order.Id;
                worksheet.Cell(row, 2).Value = order.CreatedAt.ToString("dd/MM/yyyy HH:mm");
                worksheet.Cell(row, 3).Value = order.User.FullName;
                worksheet.Cell(row, 4).Value = order.PhoneNumber;
                worksheet.Cell(row, 5).Value = order.ShippingAddress;
                worksheet.Cell(row, 6).Value = order.TotalAmount;
                worksheet.Cell(row, 7).Value = order.ShippingFee;
                worksheet.Cell(row, 8).Value = GetOrderStatusName(order.Status);
                worksheet.Cell(row, 9).Value = order.Source.ToString();
                
                var productDetails = string.Join(", ", order.OrderItems.Select(oi => $"{oi.Watch.Name} (x{oi.Quantity})"));
                worksheet.Cell(row, 10).Value = productDetails;

                row++;
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        public async Task<byte[]> ExportRevenueToExcelAsync(DateTime? startDate, DateTime? endDate)
        {
            var query = _orderRepository.GetQueryable()
                .Where(o => o.Status == OrderStatus.Delivered)
                .AsNoTracking()
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(o => o.CreatedAt >= startDate.Value);
            
            if (endDate.HasValue)
                query = query.Where(o => o.CreatedAt <= endDate.Value);

            var orders = await query.ToListAsync();

            // Nhóm theo ngày
            var dailyRevenue = orders
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalOrders = g.Count(),
                    Revenue = g.Sum(o => o.TotalAmount),
                    ShippingFee = g.Sum(o => o.ShippingFee)
                })
                .OrderBy(r => r.Date)
                .ToList();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Revenue");

            // Headers
            worksheet.Cell(1, 1).Value = "Ngày";
            worksheet.Cell(1, 2).Value = "Số Đơn Hàng Hoàn Thành";
            worksheet.Cell(1, 3).Value = "Doanh Thu Bán Hàng (VND)";
            worksheet.Cell(1, 4).Value = "Phí Vận Chuyển Thu Được (VND)";
            worksheet.Cell(1, 5).Value = "Tổng Doanh Thu (VND)";

            // Format Header
            var headerRow = worksheet.Row(1);
            headerRow.Style.Font.Bold = true;
            headerRow.Style.Fill.BackgroundColor = XLColor.Green;
            headerRow.Style.Font.FontColor = XLColor.White;
            headerRow.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            // Data
            int row = 2;
            decimal totalRev = 0;
            decimal totalShipping = 0;
            int totalOrders = 0;

            foreach (var record in dailyRevenue)
            {
                worksheet.Cell(row, 1).Value = record.Date.ToString("dd/MM/yyyy");
                worksheet.Cell(row, 2).Value = record.TotalOrders;
                worksheet.Cell(row, 3).Value = record.Revenue - record.ShippingFee; // Doanh thu thuần sp
                worksheet.Cell(row, 4).Value = record.ShippingFee;
                worksheet.Cell(row, 5).Value = record.Revenue; // Tổng tiền thanh toán

                totalOrders += record.TotalOrders;
                totalShipping += record.ShippingFee;
                totalRev += record.Revenue;

                row++;
            }

            // Dòng tổng
            worksheet.Cell(row, 1).Value = "TỔNG CỘNG";
            worksheet.Cell(row, 1).Style.Font.Bold = true;
            worksheet.Cell(row, 2).Value = totalOrders;
            worksheet.Cell(row, 2).Style.Font.Bold = true;
            worksheet.Cell(row, 3).Value = totalRev - totalShipping;
            worksheet.Cell(row, 3).Style.Font.Bold = true;
            worksheet.Cell(row, 4).Value = totalShipping;
            worksheet.Cell(row, 4).Style.Font.Bold = true;
            worksheet.Cell(row, 5).Value = totalRev;
            worksheet.Cell(row, 5).Style.Font.Bold = true;

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        private string GetOrderStatusName(OrderStatus status)
        {
            return status switch
            {
                OrderStatus.Pending => "Chờ xác nhận",
                OrderStatus.Processing => "Đang xử lý",
                OrderStatus.Shipped => "Đang giao",
                OrderStatus.Delivered => "Hoàn thành",
                OrderStatus.Cancelled => "Đã hủy",
                _ => status.ToString()
            };
        }
    }
}
