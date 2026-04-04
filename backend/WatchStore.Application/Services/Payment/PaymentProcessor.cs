using Microsoft.Extensions.Logging;

namespace WatchStore.Application.Services.Payment
{
    /// <summary>
    /// Bridge Pattern - Abstraction
    /// Abstract base class cho payment processing
    /// Sử dụng IPaymentProvider để delegate implementation details
    /// </summary>
    public abstract class PaymentProcessor
    {
        protected readonly IPaymentProvider _provider;
        protected readonly ILogger<PaymentProcessor> _logger;

        protected PaymentProcessor(IPaymentProvider provider, ILogger<PaymentProcessor> logger)
        {
            _provider = provider;
            _logger = logger;
        }

        /// <summary>
        /// Template method - xử lý payment flow
        /// </summary>
        public async Task<PaymentUrlResult> ProcessPaymentAsync(PaymentRequest request)
        {
            _logger.LogInformation("Processing payment for Order {OrderId} using {Provider}",
                request.OrderId, _provider.ProviderName);

            // Pre-processing hook
            await BeforeProcessPaymentAsync(request);

            // Check provider availability
            if (!await _provider.IsAvailableAsync())
            {
                _logger.LogWarning("Payment provider {Provider} is not available", _provider.ProviderName);
                return new PaymentUrlResult
                {
                    Success = false,
                    ErrorMessage = $"Payment provider {_provider.ProviderName} is currently unavailable"
                };
            }

            // Validate request
            var validationError = ValidatePaymentRequest(request);
            if (!string.IsNullOrEmpty(validationError))
            {
                _logger.LogWarning("Payment request validation failed: {Error}", validationError);
                return new PaymentUrlResult
                {
                    Success = false,
                    ErrorMessage = validationError
                };
            }

            // Delegate to provider (Bridge pattern core)
            var result = await _provider.CreatePaymentUrlAsync(request);

            // Post-processing hook
            await AfterProcessPaymentAsync(request, result);

            return result;
        }

        /// <summary>
        /// Validate payment response from gateway
        /// </summary>
        public async Task<PaymentValidationResult> ValidatePaymentAsync(Dictionary<string, string> responseData)
        {
            _logger.LogInformation("Validating payment response from {Provider}", _provider.ProviderName);

            // Delegate to provider (Bridge pattern core)
            var result = await _provider.ValidatePaymentResponseAsync(responseData);

            _logger.LogInformation("Payment validation result: IsValid={IsValid}, IsSuccess={IsSuccess}, OrderId={OrderId}",
                result.IsValid, result.IsSuccess, result.OrderId);

            return result;
        }

        /// <summary>
        /// Hook method - implemented by subclasses
        /// </summary>
        protected virtual Task BeforeProcessPaymentAsync(PaymentRequest request)
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Hook method - implemented by subclasses
        /// </summary>
        protected virtual Task AfterProcessPaymentAsync(PaymentRequest request, PaymentUrlResult result)
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Validation logic - can be overridden by subclasses
        /// </summary>
        protected virtual string? ValidatePaymentRequest(PaymentRequest request)
        {
            if (request.OrderId <= 0)
                return "Invalid Order ID";

            if (request.Amount <= 0)
                return "Invalid payment amount";

            if (string.IsNullOrEmpty(request.OrderInfo))
                return "Order info is required";

            return null;
        }

        /// <summary>
        /// Get payment method type
        /// </summary>
        public abstract PaymentMethod GetPaymentMethod();
    }
}
