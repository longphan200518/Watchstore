namespace WatchStore.Application.Services.Payment
{
    /// <summary>
    /// Bridge Pattern - Implementor Interface
    /// Định nghĩa interface cho các payment provider (VNPay, Momo, ZaloPay, etc.)
    /// </summary>
    public interface IPaymentProvider
    {
        /// <summary>
        /// Tên của payment provider
        /// </summary>
        string ProviderName { get; }

        /// <summary>
        /// Tạo URL thanh toán
        /// </summary>
        Task<PaymentUrlResult> CreatePaymentUrlAsync(PaymentRequest request);

        /// <summary>
        /// Xác thực phản hồi từ payment gateway
        /// </summary>
        Task<PaymentValidationResult> ValidatePaymentResponseAsync(Dictionary<string, string> responseData);

        /// <summary>
        /// Kiểm tra payment provider có sẵn sàng không
        /// </summary>
        Task<bool> IsAvailableAsync();
    }
}
