using Microsoft.Extensions.Logging;

namespace WatchStore.Application.Services.Payment
{
    /// <summary>
    /// Bridge Pattern - Refined Abstraction
    /// Xử lý thanh toán online (VNPay, Momo, ZaloPay, etc.)
    /// </summary>
    public class OnlinePaymentProcessor : PaymentProcessor
    {
        public OnlinePaymentProcessor(IPaymentProvider provider, ILogger<PaymentProcessor> logger)
            : base(provider, logger)
        {
        }

        public override PaymentMethod GetPaymentMethod()
        {
            return PaymentMethod.Online;
        }

        protected override async Task BeforeProcessPaymentAsync(PaymentRequest request)
        {
            _logger.LogInformation("Starting online payment for Order {OrderId} with amount {Amount}",
                request.OrderId, request.Amount);

            // Có thể thêm logic kiểm tra trước khi thanh toán online
            // Ví dụ: kiểm tra số tiền tối thiểu, tối đa cho online payment
            if (request.Amount < 10000)
            {
                _logger.LogWarning("Payment amount {Amount} is below minimum for online payment", request.Amount);
            }

            await Task.CompletedTask;
        }

        protected override async Task AfterProcessPaymentAsync(PaymentRequest request, PaymentUrlResult result)
        {
            if (result.Success)
            {
                _logger.LogInformation("Successfully created online payment URL for Order {OrderId} via {Provider}",
                    request.OrderId, _provider.ProviderName);
            }
            else
            {
                _logger.LogError("Failed to create online payment URL for Order {OrderId}: {Error}",
                    request.OrderId, result.ErrorMessage);
            }

            await Task.CompletedTask;
        }

        protected override string? ValidatePaymentRequest(PaymentRequest request)
        {
            // General validation từ base class
            var baseValidation = base.ValidatePaymentRequest(request);
            if (!string.IsNullOrEmpty(baseValidation))
                return baseValidation;

            // Validation riêng cho online payment
            if (request.Amount > 500_000_000) // 500 triệu
                return "Payment amount exceeds maximum limit for online payment";

            if (string.IsNullOrEmpty(request.IpAddress))
                return "IP Address is required for online payment";

            return null;
        }
    }

    /// <summary>
    /// Bridge Pattern - Refined Abstraction
    /// Xử lý thanh toán COD (Cash on Delivery)
    /// </summary>
    public class CODPaymentProcessor : PaymentProcessor
    {
        public CODPaymentProcessor(IPaymentProvider provider, ILogger<PaymentProcessor> logger)
            : base(provider, logger)
        {
        }

        public override PaymentMethod GetPaymentMethod()
        {
            return PaymentMethod.COD;
        }

        protected override async Task BeforeProcessPaymentAsync(PaymentRequest request)
        {
            _logger.LogInformation("Processing COD payment for Order {OrderId}", request.OrderId);
            await Task.CompletedTask;
        }

        protected override string? ValidatePaymentRequest(PaymentRequest request)
        {
            var baseValidation = base.ValidatePaymentRequest(request);
            if (!string.IsNullOrEmpty(baseValidation))
                return baseValidation;

            // COD có giới hạn số tiền thấp hơn
            if (request.Amount > 50_000_000) // 50 triệu
                return "COD payment is not available for orders exceeding 50 million VND";

            return null;
        }
    }
}
