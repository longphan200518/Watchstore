using Microsoft.AspNetCore.SignalR;
using WatchStore.Application.Interfaces;
using WatchStore.API.Hubs;
using System.Threading.Tasks;

namespace WatchStore.API.Services
{
    public class AdminNotificationService : IAdminNotificationService
    {
        private readonly IHubContext<AdminHub> _hubContext;

        public AdminNotificationService(IHubContext<AdminHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyNewOrderAsync(int orderId, string customerName, decimal totalAmount)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNewOrder", new
            {
                OrderId = orderId,
                CustomerName = customerName,
                TotalAmount = totalAmount
            });
        }
    }
}
