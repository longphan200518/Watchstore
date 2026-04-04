namespace WatchStore.Application.Services.Payment
{
    /// <summary>
    /// Request để tạo payment URL
    /// </summary>
    public class PaymentRequest
    {
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string OrderInfo { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string? ReturnUrl { get; set; }
        public Dictionary<string, string>? AdditionalData { get; set; }
    }

    /// <summary>
    /// Kết quả trả về sau khi tạo payment URL
    /// </summary>
    public class PaymentUrlResult
    {
        public bool Success { get; set; }
        public string PaymentUrl { get; set; } = string.Empty;
        public string? ErrorMessage { get; set; }
        public string? TransactionId { get; set; }
    }

    /// <summary>
    /// Kết quả xác thực payment response
    /// </summary>
    public class PaymentValidationResult
    {
        public bool IsValid { get; set; }
        public bool IsSuccess { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public string ResponseCode { get; set; } = string.Empty;
        public string? ErrorMessage { get; set; }
        public Dictionary<string, string>? RawData { get; set; }
    }

    /// <summary>
    /// Enum cho payment method types
    /// </summary>
    public enum PaymentMethod
    {
        Online,      // VNPay, Momo, ZaloPay
        Wallet,      // E-wallet
        COD,         // Cash on Delivery
        BankTransfer // Bank Transfer
    }

    /// <summary>
    /// Enum cho payment provider types
    /// </summary>
    public enum PaymentProviderType
    {
        VNPay,
        Momo,
        ZaloPay,
        COD,
        BankTransfer
    }
}
