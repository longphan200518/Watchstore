using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using WatchStore.Application.Interfaces;

namespace WatchStore.Application.Features.Auth
{
  public class EmailService : IEmailService
  {
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
      _configuration = configuration;
    }

    public async Task<bool> SendVerificationEmailAsync(string email, string otp)
    {
      try
      {
        var subject = "Xác thực Email - WatchStore";
        var body = GenerateVerificationEmailBody(otp);

        await SendEmailAsync(email, subject, body);
        return true;
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error sending verification email: {ex.Message}");
        return false;
      }
    }

    public async Task<bool> SendPasswordResetEmailAsync(string email, string otp)
    {
      try
      {
        var subject = "Đặt lại Mật khẩu - WatchStore";
        var body = GeneratePasswordResetEmailBody(otp);

        await SendEmailAsync(email, subject, body);
        return true;
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error sending password reset email: {ex.Message}");
        return false;
      }
    }

    private async Task SendEmailAsync(string to, string subject, string body)
    {
      var smtpSettings = _configuration.GetSection("SmtpSettings");
      var host = smtpSettings["Host"];
      var port = int.Parse(smtpSettings["Port"] ?? "587");
      var username = smtpSettings["Username"];
      var password = smtpSettings["Password"];
      var fromEmail = smtpSettings["FromEmail"];
      var fromName = smtpSettings["FromName"];

      Console.WriteLine($"[EMAIL] Attempting to send email to: {to}");
      Console.WriteLine($"[EMAIL] SMTP Host: {host}:{port}");
      Console.WriteLine($"[EMAIL] From: {fromEmail}");
      Console.WriteLine($"[EMAIL] Username: {username}");

      using (var client = new SmtpClient(host, port))
      {
        client.EnableSsl = true;
        client.Credentials = new NetworkCredential(username, password);

        var message = new MailMessage
        {
          From = new MailAddress(fromEmail!, fromName),
          Subject = subject,
          Body = body,
          IsBodyHtml = true
        };

        message.To.Add(to);

        await client.SendMailAsync(message);
        Console.WriteLine($"[EMAIL] Email sent successfully to {to}");
      }
    }

    private string GenerateVerificationEmailBody(string otp)
    {
      return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #f4a460; padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0; }}
        .content {{ background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }}
        .otp-code {{ font-size: 32px; font-weight: bold; color: #f4a460; text-align: center; padding: 20px; background-color: #fff; border: 2px dashed #f4a460; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding-top: 20px; font-size: 12px; color: #666; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>WatchStore - Xác thực Email</h1>
        </div>
        <div class='content'>
            <p>Xin chào,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại WatchStore. Vui lòng sử dụng mã xác thực dưới đây để hoàn thành quá trình đăng ký:</p>
            
            <div class='otp-code'>{otp}</div>
            
            <p><strong>Lưu ý:</strong></p>
            <ul>
                <li>Mã xác thực sẽ hết hạn trong 5 phút</li>
                <li>Không chia sẻ mã này với bất kỳ ai</li>
                <li>Nếu bạn không yêu cầu đây, hãy bỏ qua email này</li>
            </ul>
            
            <p>Cần hỗ trợ? Liên hệ với chúng tôi tại: <strong>longphan200518@gmail.com</strong></p>
        </div>
        <div class='footer'>
            <p>&copy; 2024 WatchStore. Tất cả quyền được bảo vệ.</p>
        </div>
    </div>
</body>
</html>";
    }

    private string GeneratePasswordResetEmailBody(string otp)
    {
      return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #f4a460; padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0; }}
        .content {{ background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }}
        .otp-code {{ font-size: 32px; font-weight: bold; color: #f4a460; text-align: center; padding: 20px; background-color: #fff; border: 2px dashed #f4a460; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding-top: 20px; font-size: 12px; color: #666; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>WatchStore - Đặt lại Mật khẩu</h1>
        </div>
        <div class='content'>
            <p>Xin chào,</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác thực dưới đây:</p>
            
            <div class='otp-code'>{otp}</div>
            
            <p><strong>Lưu ý:</strong></p>
            <ul>
                <li>Mã xác thực sẽ hết hạn trong 5 phút</li>
                <li>Link này chỉ có hiệu lực trong 30 phút</li>
                <li>Không chia sẻ mã này với bất kỳ ai</li>
                <li>Nếu bạn không yêu cầu đây, vui lòng bỏ qua email này</li>
            </ul>
            
            <p>Cần hỗ trợ? Liên hệ với chúng tôi tại: <strong>longphan200518@gmail.com</strong></p>
        </div>
        <div class='footer'>
            <p>&copy; 2024 WatchStore. Tất cả quyền được bảo vệ.</p>
        </div>
    </div>
</body>
</html>";
    }

    public async Task SendOrderConfirmationEmailAsync(string toEmail, string customerName, int orderId, decimal totalAmount, List<(string ProductName, int Quantity, decimal Price, string ImageUrl)> orderItems, string shippingAddress, string phoneNumber)
    {
      var subject = $"Xác nhận đơn hàng #{orderId} - WatchStore";
      
      var itemsHtml = string.Join("", orderItems.Select(item => $@"
        <tr>
          <td style='padding: 10px; border-bottom: 1px solid #ddd;'>
            <img src='{item.ImageUrl}' alt='{item.ProductName}' style='width: 60px; height: 60px; object-fit: cover; border-radius: 5px; vertical-align: middle; margin-right: 10px;'>
            <span style='vertical-align: middle;'>{item.ProductName}</span>
          </td>
          <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: center;'>{item.Quantity}</td>
          <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>{item.Price:N0} VNĐ</td>
          <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;'>{(item.Quantity * item.Price):N0} VNĐ</td>
        </tr>"));

      var body = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }}
        .container {{ max-width: 650px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .header {{ background: linear-gradient(135deg, #f4a460 0%, #d4834f 100%); padding: 30px; text-align: center; color: white; }}
        .header h1 {{ margin: 0; font-size: 28px; }}
        .content {{ padding: 30px; }}
        .section {{ margin-bottom: 25px; }}
        .section-title {{ font-size: 18px; font-weight: bold; color: #f4a460; margin-bottom: 10px; border-bottom: 2px solid #f4a460; padding-bottom: 5px; }}
        .info-box {{ background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #f4a460; }}
        .info-box p {{ margin: 8px 0; }}
        .info-box strong {{ color: #333; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 15px; }}
        th {{ background: #f4a460; color: white; padding: 12px; text-align: left; }}
        td {{ padding: 10px; border-bottom: 1px solid #ddd; }}
        .total-row {{ background: #fff3e6; font-weight: bold; font-size: 18px; }}
        .footer {{ background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }}
        .btn {{ display: inline-block; padding: 12px 30px; background: #f4a460; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 Đặt Hàng Thành Công!</h1>
            <p style='margin: 10px 0 0 0; font-size: 16px;'>Cảm ơn bạn đã tin tưởng WatchStore</p>
        </div>
        <div class='content'>
            <div class='section'>
                <p style='font-size: 16px;'>Xin chào <strong>{customerName}</strong>,</p>
                <p>Đơn hàng của bạn đã được đặt thành công và đang được xử lý. Dưới đây là thông tin chi tiết:</p>
            </div>

            <div class='section'>
                <div class='section-title'>📋 Thông Tin Đơn Hàng</div>
                <div class='info-box'>
                    <p><strong>Mã đơn hàng:</strong> #{orderId}</p>
                    <p><strong>Ngày đặt:</strong> {DateTime.Now:dd/MM/yyyy HH:mm}</p>
                    <p><strong>Trạng thái:</strong> <span style='color: #f59e0b;'>Đang xử lý</span></p>
                </div>
            </div>

            <div class='section'>
                <div class='section-title'>🚚 Thông Tin Giao Hàng</div>
                <div class='info-box'>
                    <p><strong>Địa chỉ:</strong> {shippingAddress}</p>
                    <p><strong>Số điện thoại:</strong> {phoneNumber}</p>
                </div>
            </div>

            <div class='section'>
                <div class='section-title'>📦 Chi Tiết Sản Phẩm</div>
                <table>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th style='text-align: center; width: 80px;'>Số lượng</th>
                            <th style='text-align: right; width: 120px;'>Đơn giá</th>
                            <th style='text-align: right; width: 120px;'>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsHtml}
                        <tr class='total-row'>
                            <td colspan='3' style='text-align: right; padding: 15px;'>Tổng cộng:</td>
                            <td style='text-align: right; padding: 15px; color: #f4a460;'>{totalAmount:N0} VNĐ</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class='section'>
                <p>✅ Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.</p>
                <p>📧 Bạn sẽ nhận được email thông báo khi đơn hàng được giao.</p>
                <p>❓ Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ: <strong>longphan200518@gmail.com</strong></p>
            </div>

            <div style='text-align: center; margin-top: 30px;'>
                <p style='margin: 0; color: #666;'>Trân trọng,</p>
                <p style='margin: 5px 0; font-weight: bold; color: #f4a460; font-size: 16px;'>Đội ngũ WatchStore</p>
            </div>
        </div>
        <div class='footer'>
            <p>&copy; 2024 WatchStore. Tất cả quyền được bảo vệ.</p>
            <p style='margin-top: 5px;'>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>";

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
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #f4a460; padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0; }}
        .content {{ background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }}
        .status {{ font-size: 24px; font-weight: bold; color: #10b981; text-align: center; padding: 15px; background: white; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding-top: 20px; font-size: 12px; color: #666; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>WatchStore</h1>
        </div>
        <div class='content'>
            <h2>Xin chào {customerName},</h2>
            <p>Đơn hàng #{orderId} của bạn đã được cập nhật trạng thái:</p>
            <div class='status'>{statusText}</div>
            <p>Bạn có thể theo dõi chi tiết đơn hàng trên website của chúng tôi.</p>
            <p style='margin-top: 30px;'>Trân trọng,<br><strong>Đội ngũ WatchStore</strong></p>
        </div>
        <div class='footer'>
            <p>&copy; 2024 WatchStore. Tất cả quyền được bảo vệ.</p>
        </div>
    </div>
</body>
</html>";

      await SendEmailAsync(toEmail, subject, body);
    }
  }
}
