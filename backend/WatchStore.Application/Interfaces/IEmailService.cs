namespace WatchStore.Application.Interfaces
{
  public interface IEmailService
  {
    Task<bool> SendVerificationEmailAsync(string email, string otp);
    Task<bool> SendPasswordResetEmailAsync(string email, string otp);
    Task SendOrderConfirmationEmailAsync(string toEmail, string customerName, int orderId, decimal totalAmount, List<(string ProductName, int Quantity, decimal Price, string ImageUrl)> orderItems, string shippingAddress, string phoneNumber);
    Task SendOrderStatusUpdateEmailAsync(string toEmail, string customerName, int orderId, string newStatus);
  }
}
