namespace WatchStore.Application.Services.Payment
{
    /// <summary>
    /// Bridge Pattern - Concrete Implementor
    /// COD (Cash on Delivery) payment provider
    /// </summary>
    public class CODProvider : IPaymentProvider
    {
        public string ProviderName => "COD";

        public async Task<PaymentUrlResult> CreatePaymentUrlAsync(PaymentRequest request)
        {
            // COD không cần payment URL, chỉ cần xác nhận
            return await Task.FromResult(new PaymentUrlResult
            {
                Success = true,
                PaymentUrl = string.Empty, // No URL needed for COD
                TransactionId = $"COD_{request.OrderId}_{DateTime.Now:yyyyMMddHHmmss}"
            });
        }

        public async Task<PaymentValidationResult> ValidatePaymentResponseAsync(Dictionary<string, string> responseData)
        {
            // COD payment luôn valid ngay sau khi đặt hàng
            // Sẽ được confirm khi giao hàng thành công
            var orderId = responseData.ContainsKey("orderId")
                ? int.Parse(responseData["orderId"])
                : 0;

            return await Task.FromResult(new PaymentValidationResult
            {
                IsValid = true,
                IsSuccess = true, // COD automatically approved
                OrderId = orderId,
                ResponseCode = "COD_APPROVED",
                TransactionId = $"COD_{orderId}_{DateTime.Now:yyyyMMddHHmmss}"
            });
        }

        public async Task<bool> IsAvailableAsync()
        {
            // COD luôn available
            return await Task.FromResult(true);
        }
    }
}
