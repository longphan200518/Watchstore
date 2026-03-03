namespace WatchStore.Application.Features.Auth.EmailMessages
{
    /// <summary>
    /// Concrete Product - Order Confirmation Email
    /// </summary>
    public class OrderConfirmationEmail : EmailMessage
    {
        private readonly string _customerName;
        private readonly int _orderId;
        private readonly decimal _totalAmount;
        private readonly List<(string ProductName, int Quantity, decimal Price, string ImageUrl)> _orderItems;
        private readonly string _shippingAddress;
        private readonly string _phoneNumber;

        public OrderConfirmationEmail(
            string toEmail,
            string customerName,
            int orderId,
            decimal totalAmount,
            List<(string ProductName, int Quantity, decimal Price, string ImageUrl)> orderItems,
            string shippingAddress,
            string phoneNumber)
        {
            ToEmail = toEmail;
            _customerName = customerName;
            _orderId = orderId;
            _totalAmount = totalAmount;
            _orderItems = orderItems;
            _shippingAddress = shippingAddress;
            _phoneNumber = phoneNumber;
            Subject = $"Xác nhận đơn hàng #{orderId} - WatchStore";
        }

        public override string GenerateBody()
        {
            var itemsHtml = string.Join("", _orderItems.Select(item => $@"
        <tr>
          <td style='padding: 10px; border-bottom: 1px solid #ddd;'>
            <img src='{item.ImageUrl}' alt='{item.ProductName}' style='width: 60px; height: 60px; object-fit: cover; border-radius: 5px; vertical-align: middle; margin-right: 10px;'>
            <span style='vertical-align: middle;'>{item.ProductName}</span>
          </td>
          <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: center;'>{item.Quantity}</td>
          <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>{item.Price:N0} VNĐ</td>
          <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;'>{(item.Quantity * item.Price):N0} VNĐ</td>
        </tr>"));

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }}
        .container {{ max-width: 650px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .header {{ background: linear-gradient(135deg, #f4a460 0%, #d4834f 100%); padding: 30px; text-align: center; color: white; }}
        .header h1 {{ margin: 0; font-size: 28px; }}
        .content {{ padding: 30px; }}
        .section {{ margin-bottom: 25px; }}
        .section-title {{ font-size: 18px; font-weight: bold; color: #f4a460; margin-bottom: 10px; border-bottom: 2px solid #f4a460; padding-bottom: 5px; }}
        .info-box {{ background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #f4a460; }}
        .info-box p {{ margin: 8px 0; }}
        .info-box strong {{ color: #333; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 15px; }}
        th {{ background: #f4a460; color: white; padding: 12px; text-align: left; }}
        td {{ padding: 10px; border-bottom: 1px solid #ddd; }}
        .total-row {{ background: #fff3e6; font-weight: bold; font-size: 18px; }}
        .footer {{ background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 Đặt Hàng Thành Công!</h1>
            <p style='margin: 10px 0 0 0; font-size: 16px;'>Cảm ơn bạn đã tin tưởng WatchStore</p>
        </div>
        <div class='content'>
            <div class='section'>
                <p style='font-size: 16px;'>Xin chào <strong>{_customerName}</strong>,</p>
                <p>Đơn hàng của bạn đã được đặt thành công và đang được xử lý. Dưới đây là thông tin chi tiết:</p>
            </div>

            <div class='section'>
                <div class='section-title'>📋 Thông Tin Đơn Hàng</div>
                <div class='info-box'>
                    <p><strong>Mã đơn hàng:</strong> #{_orderId}</p>
                    <p><strong>Ngày đặt:</strong> {DateTime.Now:dd/MM/yyyy HH:mm}</p>
                    <p><strong>Trạng thái:</strong> <span style='color: #f59e0b;'>Đang xử lý</span></p>
                </div>
            </div>

            <div class='section'>
                <div class='section-title'>🚚 Thông Tin Giao Hàng</div>
                <div class='info-box'>
                    <p><strong>Địa chỉ:</strong> {_shippingAddress}</p>
                    <p><strong>Số điện thoại:</strong> {_phoneNumber}</p>
                </div>
            </div>

            <div class='section'>
                <div class='section-title'>📦 Chi Tiết Sản Phẩm</div>
                <table>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th style='text-align: center; width: 80px;'>Số lượng</th>
                            <th style='text-align: right; width: 120px;'>Đơn giá</th>
                            <th style='text-align: right; width: 120px;'>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsHtml}
                        <tr class='total-row'>
                            <td colspan='3' style='text-align: right; padding: 15px;'>Tổng cộng:</td>
                            <td style='text-align: right; padding: 15px; color: #f4a460;'>{_totalAmount:N0} VNĐ</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class='section'>
                <p>✅ Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.</p>
                <p>📧 Bạn sẽ nhận được email thông báo khi đơn hàng được giao.</p>
                <p>❓ Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ: <strong>longphan200518@gmail.com</strong></p>
            </div>

            <div style='text-align: center; margin-top: 30px;'>
                <p style='margin: 0; color: #666;'>Trân trọng,</p>
                <p style='margin: 5px 0; font-weight: bold; color: #f4a460; font-size: 16px;'>Đội ngũ WatchStore</p>
            </div>
        </div>
        <div class='footer'>
            <p>&copy; 2024 WatchStore. Tất cả quyền được bảo vệ.</p>
            <p style='margin-top: 5px;'>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>";
        }
    }
}
