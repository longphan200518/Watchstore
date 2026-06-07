using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;
using WatchStore.Application.Interfaces;
using WatchStore.Application.Features.Auth.EmailMessages;

namespace WatchStore.Application.Features.Auth
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendVerificationEmailAsync(string email, string otp)
        {
            try
            {
                var message = EmailMessageFactory.CreateVerificationEmail(email, otp);
                await SendEmailMessageAsync(message);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending verification email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendPasswordResetEmailAsync(string email, string otp)
        {
            try
            {
                var message = EmailMessageFactory.CreatePasswordResetEmail(email, otp);
                await SendEmailMessageAsync(message);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending password reset email to {Email}", email);
                return false;
            }
        }

        private async Task SendEmailMessageAsync(EmailMessage message)
        {
            await SendEmailAsync(message.ToEmail, message.Subject, message.GenerateBody());
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
            var enableSsl = bool.TryParse(smtpSettings["EnableSsl"], out var parsedEnableSsl) && parsedEnableSsl;

            if (string.IsNullOrWhiteSpace(host) ||
                string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(password) ||
                string.IsNullOrWhiteSpace(fromEmail))
            {
                throw new InvalidOperationException("Missing or invalid SmtpSettings configuration");
            }

            _logger.LogInformation("Attempting to send email to {Email} via {Host}:{Port}", to, host, port);

            using (var client = new SmtpClient(host, port))
            {
                client.EnableSsl = enableSsl;
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
                _logger.LogInformation("Email sent successfully to {Email}", to);
            }
        }

        public async Task SendOrderConfirmationEmailAsync(string toEmail, string customerName, int orderId, decimal totalAmount, List<(string ProductName, int Quantity, decimal Price, string ImageUrl)> orderItems, string shippingAddress, string phoneNumber)
        {
            var message = EmailMessageFactory.CreateOrderConfirmationEmail(
              toEmail,
              customerName,
              orderId,
              totalAmount,
              orderItems,
              shippingAddress,
              phoneNumber);

            await SendEmailMessageAsync(message);
        }

        public async Task SendOrderStatusUpdateEmailAsync(string toEmail, string customerName, int orderId, string newStatus)
        {
            var message = EmailMessageFactory.CreateOrderStatusUpdateEmail(
              toEmail,
              customerName,
              orderId,
              newStatus);

            await SendEmailMessageAsync(message);
        }
    }
}
