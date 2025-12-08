using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace WatchStore.Application.Services
{
    public interface IEmailService
    {
        Task SendOrderConfirmationEmailAsync(string toEmail, string customerName, int orderId, decimal totalAmount);
        Task SendOrderStatusUpdateEmailAsync(string toEmail, string customerName, int orderId, string newStatus);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly SmtpClient _smtpClient;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;

            var host = _configuration["Email:SmtpHost"];
            var port = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var username = _configuration["Email:Username"];
            var password = _configuration["Email:Password"];
            var enableSsl = bool.Parse(_configuration["Email:EnableSsl"] ?? "true");

            _smtpClient = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = enableSsl
            };
        }

        public async Task SendOrderConfirmationEmailAsync(string toEmail, string customerName, int orderId, decimal totalAmount)
        {
            var subject = $"Xác nhận đơn hàng #{orderId} - WatchStore";
            var body = $@"
                <html>
                <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                        <h2 style='color: #f59e0b; text-align: center;'>WatchStore</h2>
                        <h3>Xin chào {customerName},</h3>
                        <p>Cảm ơn bạn đã đặt hàng tại WatchStore!</p>
                        <div style='background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                            <p><strong>Mã đơn hàng:</strong> #{orderId}</p>
                            <p><strong>Tổng tiền:</strong> {totalAmount:N0} VNĐ</p>
                            <p><strong>Trạng thái:</strong> Đang xử lý</p>
                        </div>
                        <p>Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất. Bạn sẽ nhận được email thông báo khi đơn hàng được giao.</p>
                        <p style='margin-top: 30px;'>Trân trọng,<br><strong>Đội ngũ WatchStore</strong></p>
                    </div>
                </body>
                </html>
            ";

            await SendEmailAsync(toEmail, subject, body);
        }

        public async Task SendOrderStatusUpdateEmailAsync(string toEmail, string customerName, int orderId, string newStatus)
        {
            var statusText = newStatus switch
            {
                "Pending" => "Chờ xử lý",
                "Processing" => "Đang xử lý",
                "Shipped" => "Đang giao hàng",
                "Delivered" => "Đã giao hàng",
                "Cancelled" => "Đã hủy",
                _ => newStatus
            };

            var subject = $"Cập nhật đơn hàng #{orderId} - WatchStore";
            var body = $@"
                <html>
                <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                        <h2 style='color: #f59e0b; text-align: center;'>WatchStore</h2>
                        <h3>Xin chào {customerName},</h3>
                        <p>Đơn hàng #{orderId} của bạn đã được cập nhật trạng thái:</p>
                        <div style='background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;'>
                            <p style='font-size: 24px; font-weight: bold; color: #10b981; margin: 0;'>{statusText}</p>
                        </div>
                        <p>Bạn có thể theo dõi chi tiết đơn hàng trên website của chúng tôi.</p>
                        <p style='margin-top: 30px;'>Trân trọng,<br><strong>Đội ngũ WatchStore</strong></p>
                    </div>
                </body>
                </html>
            ";

            await SendEmailAsync(toEmail, subject, body);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var fromEmail = _configuration["Email:FromEmail"] ?? "noreply@watchstore.com";
            var fromName = _configuration["Email:FromName"] ?? "WatchStore";

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            try
            {
                await _smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                // Log error - in production, use proper logging
                Console.WriteLine($"Failed to send email: {ex.Message}");
                throw;
            }
        }
    }
}
