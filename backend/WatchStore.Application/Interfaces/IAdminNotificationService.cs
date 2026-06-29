using System.Threading.Tasks;

namespace WatchStore.Application.Interfaces
{
    public interface IAdminNotificationService
    {
        Task NotifyNewOrderAsync(int orderId, string customerName, decimal totalAmount);
    }
}
