using Microsoft.AspNetCore.SignalR;

namespace WatchStore.API.Hubs
{
    public class AdminHub : Hub
    {
        // Hub này dùng để đẩy thông báo cho Admin.
        // Client (Frontend Admin) sẽ kết nối và lắng nghe sự kiện "ReceiveNewOrder".
    }
}
