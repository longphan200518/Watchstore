namespace WatchStore.Application.Features.Auth.EmailMessages
{
    /// <summary>
    /// Concrete Product - Order Status Update Email
    /// </summary>
    public class OrderStatusUpdateEmail : EmailMessage
    {
        private readonly string _customerName;
        private readonly int _orderId;
        private readonly string _newStatus;

        public OrderStatusUpdateEmail(string toEmail, string customerName, int orderId, string newStatus)
        {
            ToEmail = toEmail;
            _customerName = customerName;
            _orderId = orderId;
            _newStatus = newStatus;
            Subject = $"Cập nhật đơn hàng #{orderId} - WatchStore";
        }

        public override string GenerateBody()
        {
            var statusText = _newStatus switch
            {
                "Pending" => "Chờ xử lý",
                "Processing" => "Đang xử lý",
                "Shipped" => "Đang giao hàng",
                "Delivered" => "Đã giao hàng",
                "Cancelled" => "Đã hủy",
                _ => _newStatus
            };

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        {GetCommonStyles()}
        .status {{ font-size: 24px; font-weight: bold; color: #10b981; text-align: center; padding: 15px; background: white; border-radius: 5px; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>WatchStore</h1>
        </div>
        <div class='content'>
            <h2>Xin chào {_customerName},</h2>
            <p>Đơn hàng #{_orderId} của bạn đã được cập nhật trạng thái:</p>
            <div class='status'>{statusText}</div>
            <p>Bạn có thể theo dõi chi tiết đơn hàng trên website của chúng tôi.</p>
            <p style='margin-top: 30px;'>Trân trọng,<br><strong>Đội ngũ WatchStore</strong></p>
        </div>
        {GetFooter()}
    </div>
</body>
</html>";
        }
    }
}
