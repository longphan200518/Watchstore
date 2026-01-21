using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace WatchStore.Application.Services
{
  public class VNPayService
  {
    private readonly IConfiguration _configuration;
    private const string VERSION = "2.1.0";

    public VNPayService(IConfiguration configuration)
    {
      _configuration = configuration;
    }

    public string CreatePaymentUrl(int orderId, decimal amount, string orderInfo, string ipAddress)
    {
      var vnpayUrl = _configuration["VNPay:Url"];
      var vnpayTmnCode = _configuration["VNPay:TmnCode"];
      var vnpayHashSecret = _configuration["VNPay:HashSecret"];
      var returnUrl = _configuration["VNPay:ReturnUrl"];

      var vnpay = new VNPayLibrary();
      vnpay.AddRequestData("vnp_Version", VERSION);
      vnpay.AddRequestData("vnp_Command", "pay");
      vnpay.AddRequestData("vnp_TmnCode", vnpayTmnCode);
      vnpay.AddRequestData("vnp_Amount", ((long)(amount * 100)).ToString());
      vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
      vnpay.AddRequestData("vnp_CurrCode", "VND");
      vnpay.AddRequestData("vnp_IpAddr", ipAddress);
      vnpay.AddRequestData("vnp_Locale", "vn");
      vnpay.AddRequestData("vnp_OrderInfo", orderInfo);
      vnpay.AddRequestData("vnp_OrderType", "other");
      vnpay.AddRequestData("vnp_ReturnUrl", returnUrl);
      vnpay.AddRequestData("vnp_TxnRef", orderId.ToString());

      var paymentUrl = vnpay.CreateRequestUrl(vnpayUrl, vnpayHashSecret);
      return paymentUrl;
    }

    public bool ValidateSignature(Dictionary<string, string> vnpayData, string vnpSecureHash)
    {
      var vnpayHashSecret = _configuration["VNPay:HashSecret"];
      var vnpay = new VNPayLibrary();

      foreach (var (key, value) in vnpayData)
      {
        if (!string.IsNullOrEmpty(value) && key != "vnp_SecureHash" && key != "vnp_SecureHashType")
        {
          vnpay.AddResponseData(key, value);
        }
      }

      var checkSignature = vnpay.ValidateSignature(vnpSecureHash, vnpayHashSecret);
      return checkSignature;
    }
  }

  public class VNPayLibrary
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
