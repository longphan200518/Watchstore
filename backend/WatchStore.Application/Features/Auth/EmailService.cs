using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using WatchStore.Application.Interfaces;
using WatchStore.Application.Features.Auth.EmailMessages;

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
                var emailMessage = EmailMessageFactory.CreateVerificationEmail(email, otp);
                await SendEmailAsync(emailMessage.ToEmail, emailMessage.Subject, emailMessage.GenerateBody());
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
                var emailMessage = EmailMessageFactory.CreatePasswordResetEmail(email, otp);
                await SendEmailAsync(emailMessage.ToEmail, emailMessage.Subject, emailMessage.GenerateBody());
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending password reset email: {ex.Message}");
                return false;
            }
        }

        public async Task SendOrderConfirmationEmailAsync(
            string toEmail,
            string customerName,
            int orderId,
            decimal totalAmount,
            List<(string ProductName, int Quantity, decimal Price, string ImageUrl)> orderItems,
            string shippingAddress,
            string phoneNumber)
        {
            var emailMessage = EmailMessageFactory.CreateOrderConfirmationEmail(
                toEmail,
                customerName,
                orderId,
                totalAmount,
                orderItems,
                shippingAddress,
                phoneNumber);

            await SendEmailAsync(emailMessage.ToEmail, emailMessage.Subject, emailMessage.GenerateBody());
        }

        public async Task SendOrderStatusUpdateEmailAsync(string toEmail, string customerName, int orderId, string newStatus)
        {
            var emailMessage = EmailMessageFactory.CreateOrderStatusUpdateEmail(toEmail, customerName, orderId, newStatus);
            await SendEmailAsync(emailMessage.ToEmail, emailMessage.Subject, emailMessage.GenerateBody());
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
    }
}
