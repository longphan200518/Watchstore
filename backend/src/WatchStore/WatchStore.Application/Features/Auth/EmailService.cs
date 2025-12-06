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
  }
}
