namespace WatchStore.Application.Features.Auth.EmailMessages
{
    /// <summary>
    /// Concrete Product - Verification Email
    /// </summary>
    public class VerificationEmail : EmailMessage
    {
        private readonly string _otp;

        public VerificationEmail(string toEmail, string otp)
        {
            ToEmail = toEmail;
            _otp = otp;
            Subject = "Xác thực Email - WatchStore";
        }

        public override string GenerateBody()
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        {GetCommonStyles()}
        .otp-code {{ font-size: 32px; font-weight: bold; color: #f4a460; text-align: center; padding: 20px; background-color: #fff; border: 2px dashed #f4a460; border-radius: 5px; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>WatchStore - Xác thực Email</h1>
        </div>
        <div class='content'>
            <p>Xin chào,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại WatchStore. Vui lòng sử dụng mã xác thực dưới đây để hoàn thành quá trình đăng ký:</p>
            
            <div class='otp-code'>{_otp}</div>
            
            <p><strong>Lưu ý:</strong></p>
            <ul>
                <li>Mã xác thực sẽ hết hạn trong 5 phút</li>
                <li>Không chia sẻ mã này với bất kỳ ai</li>
                <li>Nếu bạn không yêu cầu đây, hãy bỏ qua email này</li>
            </ul>
            
            <p>Cần hỗ trợ? Liên hệ với chúng tôi tại: <strong>longphan200518@gmail.com</strong></p>
        </div>
        {GetFooter()}
    </div>
</body>
</html>";
        }
    }
}
