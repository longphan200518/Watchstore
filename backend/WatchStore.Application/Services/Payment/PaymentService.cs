using Microsoft.Extensions.Logging;

namespace WatchStore.Application.Services.Payment
{
    /// <summary>
    /// Bridge Pattern - Client / Facade
    /// Service quản lý các payment processor và provider
    /// </summary>
    public class PaymentService
    {
        private readonly ILogger<PaymentProcessor> _logger;
        private readonly Dictionary<PaymentProviderType, IPaymentProvider> _providers;

        public PaymentService(
            VNPayProvider vnPayProvider,
            CODProvider codProvider,
            ILogger<PaymentProcessor> logger)
        {
            _logger = logger;
            _providers = new Dictionary<PaymentProviderType, IPaymentProvider>
            {
                { PaymentProviderType.VNPay, vnPayProvider },
                { PaymentProviderType.COD, codProvider }
                // Có thể thêm: { PaymentProviderType.Momo, momoProvider }
                // Có thể thêm: { PaymentProviderType.ZaloPay, zaloPayProvider }
            };
        }

        /// <summary>
        /// Tạo payment processor theo payment method và provider
        /// Bridge Pattern: Kết nối Abstraction với Implementor
        /// </summary>
        public PaymentProcessor CreatePaymentProcessor(PaymentMethod method, PaymentProviderType providerType)
        {
            if (!_providers.ContainsKey(providerType))
            {
                throw new ArgumentException($"Payment provider {providerType} is not supported");
            }

            var provider = _providers[providerType];

            return method switch
            {
                PaymentMethod.Online => new OnlinePaymentProcessor(provider, _logger),
                PaymentMethod.COD => new CODPaymentProcessor(provider, _logger),
                _ => throw new ArgumentException($"Payment method {method} is not supported")
            };
        }

        /// <summary>
        /// Process payment - main entry point
        /// </summary>
        public async Task<PaymentUrlResult> ProcessPaymentAsync(
            PaymentMethod method,
            PaymentProviderType providerType,
            PaymentRequest request)
        {
            var processor = CreatePaymentProcessor(method, providerType);
            return await processor.ProcessPaymentAsync(request);
        }

        /// <summary>
        /// Validate payment response
        /// </summary>
        public async Task<PaymentValidationResult> ValidatePaymentAsync(
            PaymentProviderType providerType,
            Dictionary<string, string> responseData)
        {
            if (!_providers.ContainsKey(providerType))
            {
                throw new ArgumentException($"Payment provider {providerType} is not supported");
            }

            var provider = _providers[providerType];
            var processor = new OnlinePaymentProcessor(provider, _logger);
            return await processor.ValidatePaymentAsync(responseData);
        }

        /// <summary>
        /// Get all available payment providers
        /// </summary>
        public async Task<List<PaymentProviderInfo>> GetAvailableProvidersAsync()
        {
            var availableProviders = new List<PaymentProviderInfo>();

            foreach (var (providerType, provider) in _providers)
            {
                var isAvailable = await provider.IsAvailableAsync();
                if (isAvailable)
                {
                    availableProviders.Add(new PaymentProviderInfo
                    {
                        ProviderType = providerType,
                        ProviderName = provider.ProviderName,
                        IsAvailable = true
                    });
                }
            }

            return availableProviders;
        }
    }

    /// <summary>
    /// DTO for payment provider information
    /// </summary>
    public class PaymentProviderInfo
    {
        public PaymentProviderType ProviderType { get; set; }
        public string ProviderName { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }
}
