using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;

namespace WatchStore.Application.Services.Payment
{
    /// <summary>
    /// Bridge Pattern - Concrete Implementor
    /// VNPay payment provider implementation
    /// </summary>
    public class VNPayProvider : IPaymentProvider
    {
        private readonly IConfiguration _configuration;
        private const string VERSION = "2.1.0";

        public string ProviderName => "VNPay";

        public VNPayProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PaymentUrlResult> CreatePaymentUrlAsync(PaymentRequest request)
        {
            try
            {
                var vnpayUrl = _configuration["VNPay:Url"];
                var vnpayTmnCode = _configuration["VNPay:TmnCode"];
                var vnpayHashSecret = _configuration["VNPay:HashSecret"];
                var returnUrl = request.ReturnUrl ?? _configuration["VNPay:ReturnUrl"];

                var vnpay = new VNPayLibrary();
                vnpay.AddRequestData("vnp_Version", VERSION);
                vnpay.AddRequestData("vnp_Command", "pay");
                vnpay.AddRequestData("vnp_TmnCode", vnpayTmnCode);
                vnpay.AddRequestData("vnp_Amount", ((long)(request.Amount * 100)).ToString());
                vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
                vnpay.AddRequestData("vnp_CurrCode", "VND");
                vnpay.AddRequestData("vnp_IpAddr", request.IpAddress);
                vnpay.AddRequestData("vnp_Locale", "vn");
                vnpay.AddRequestData("vnp_OrderInfo", request.OrderInfo);
                vnpay.AddRequestData("vnp_OrderType", "other");
                vnpay.AddRequestData("vnp_ReturnUrl", returnUrl);
                vnpay.AddRequestData("vnp_TxnRef", request.OrderId.ToString());

                var paymentUrl = vnpay.CreateRequestUrl(vnpayUrl, vnpayHashSecret);

                return await Task.FromResult(new PaymentUrlResult
                {
                    Success = true,
                    PaymentUrl = paymentUrl,
                    TransactionId = request.OrderId.ToString()
                });
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new PaymentUrlResult
                {
                    Success = false,
                    ErrorMessage = $"VNPay error: {ex.Message}"
                });
            }
        }

        public async Task<PaymentValidationResult> ValidatePaymentResponseAsync(Dictionary<string, string> responseData)
        {
            try
            {
                if (!responseData.ContainsKey("vnp_SecureHash"))
                {
                    return await Task.FromResult(new PaymentValidationResult
                    {
                        IsValid = false,
                        ErrorMessage = "Missing vnp_SecureHash"
                    });
                }

                var vnpSecureHash = responseData["vnp_SecureHash"];
                var vnpayHashSecret = _configuration["VNPay:HashSecret"];
                var vnpay = new VNPayLibrary();

                foreach (var (key, value) in responseData)
                {
                    if (!string.IsNullOrEmpty(value) && key != "vnp_SecureHash" && key != "vnp_SecureHashType")
                    {
                        vnpay.AddResponseData(key, value);
                    }
                }

                var isValidSignature = vnpay.ValidateSignature(vnpSecureHash, vnpayHashSecret);
                var responseCode = responseData.GetValueOrDefault("vnp_ResponseCode", "");
                var orderId = int.Parse(responseData.GetValueOrDefault("vnp_TxnRef", "0"));
                var amount = decimal.Parse(responseData.GetValueOrDefault("vnp_Amount", "0")) / 100;

                return await Task.FromResult(new PaymentValidationResult
                {
                    IsValid = isValidSignature,
                    IsSuccess = isValidSignature && responseCode == "00",
                    OrderId = orderId,
                    Amount = amount,
                    TransactionId = responseData.GetValueOrDefault("vnp_TransactionNo", ""),
                    ResponseCode = responseCode,
                    RawData = responseData
                });
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new PaymentValidationResult
                {
                    IsValid = false,
                    ErrorMessage = $"Validation error: {ex.Message}"
                });
            }
        }

        public async Task<bool> IsAvailableAsync()
        {
            var vnpayUrl = _configuration["VNPay:Url"];
            var vnpayTmnCode = _configuration["VNPay:TmnCode"];
            var vnpayHashSecret = _configuration["VNPay:HashSecret"];

            return await Task.FromResult(
                !string.IsNullOrEmpty(vnpayUrl) &&
                !string.IsNullOrEmpty(vnpayTmnCode) &&
                !string.IsNullOrEmpty(vnpayHashSecret)
            );
        }
    }

    /// <summary>
    /// VNPay Library - Helper class for VNPay integration
    /// </summary>
    internal class VNPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new();
        private readonly SortedList<string, string> _responseData = new();

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string CreateRequestUrl(string baseUrl, string vnpHashSecret)
        {
            var data = new StringBuilder();
            foreach (var (key, value) in _requestData)
            {
                data.Append(Uri.EscapeDataString(key));
                data.Append('=');
                data.Append(Uri.EscapeDataString(value));
                data.Append('&');
            }

            var querystring = data.ToString();
            if (querystring.Length > 0)
            {
                querystring = querystring.Remove(querystring.Length - 1, 1);
            }

            var signData = querystring;
            var vnpSecureHash = HmacSHA512(vnpHashSecret, signData);
            var paymentUrl = $"{baseUrl}?{querystring}&vnp_SecureHash={vnpSecureHash}";

            return paymentUrl;
        }

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            var data = new StringBuilder();
            foreach (var (key, value) in _responseData)
            {
                data.Append(Uri.EscapeDataString(key));
                data.Append('=');
                data.Append(Uri.EscapeDataString(value));
                data.Append('&');
            }

            var checksum = data.ToString();
            if (checksum.Length > 0)
            {
                checksum = checksum.Remove(checksum.Length - 1, 1);
            }

            var vnpSecureHash = HmacSHA512(secretKey, checksum);
            return vnpSecureHash.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private static string HmacSHA512(string key, string inputData)
        {
            var hash = new StringBuilder();
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                var hashValue = hmac.ComputeHash(inputBytes);
                foreach (var b in hashValue)
                {
                    hash.Append(b.ToString("x2"));
                }
            }

            return hash.ToString();
        }
    }
}
