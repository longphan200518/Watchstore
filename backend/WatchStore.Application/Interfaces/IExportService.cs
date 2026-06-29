using System;
using System.Threading.Tasks;

namespace WatchStore.Application.Interfaces
{
    public interface IExportService
    {
        Task<byte[]> ExportOrdersToExcelAsync(DateTime? startDate, DateTime? endDate);
        Task<byte[]> ExportRevenueToExcelAsync(DateTime? startDate, DateTime? endDate);
    }
}
