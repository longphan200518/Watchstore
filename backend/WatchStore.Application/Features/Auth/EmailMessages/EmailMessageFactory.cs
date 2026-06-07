namespace WatchStore.Application.Features.Auth.EmailMessages
{
    /// <summary>
    /// Factory Method Pattern - Email Message Factory
    /// </summary>
    public static class EmailMessageFactory
    {
        public static VerificationEmail CreateVerificationEmail(string toEmail, string otp)
        {
            ValidateEmail(toEmail);
            ValidateOtp(otp);

            return new VerificationEmail(toEmail, otp);
        }

        public static PasswordResetEmail CreatePasswordResetEmail(string toEmail, string otp)
        {
            ValidateEmail(toEmail);
            ValidateOtp(otp);

            return new PasswordResetEmail(toEmail, otp);
        }

        public static OrderConfirmationEmail CreateOrderConfirmationEmail(
            string toEmail,
            string customerName,
            int orderId,
            decimal totalAmount,
            List<(string ProductName, int Quantity, decimal Price, string ImageUrl)> orderItems,
            string shippingAddress,
            string phoneNumber)
        {
            ValidateEmail(toEmail);
            ValidateCustomerName(customerName);
            orderItems ??= new List<(string ProductName, int Quantity, decimal Price, string ImageUrl)>();

            return new OrderConfirmationEmail(
                toEmail,
                customerName,
                orderId,
                totalAmount,
                orderItems,
                shippingAddress,
                phoneNumber);
        }

        public static OrderStatusUpdateEmail CreateOrderStatusUpdateEmail(
            string toEmail,
            string customerName,
            int orderId,
            string newStatus)
        {
            ValidateEmail(toEmail);
            ValidateCustomerName(customerName);
            ValidateStatus(newStatus);

            return new OrderStatusUpdateEmail(toEmail, customerName, orderId, newStatus);
        }

        private static void ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("Email is required", nameof(email));
            }
        }

        private static void ValidateOtp(string otp)
        {
            if (string.IsNullOrWhiteSpace(otp))
            {
                throw new ArgumentException("OTP is required", nameof(otp));
            }
        }

        private static void ValidateCustomerName(string customerName)
        {
            if (string.IsNullOrWhiteSpace(customerName))
            {
                throw new ArgumentException("Customer name is required", nameof(customerName));
            }
        }

        private static void ValidateStatus(string newStatus)
        {
            if (string.IsNullOrWhiteSpace(newStatus))
            {
                throw new ArgumentException("Status is required", nameof(newStatus));
            }
        }
    }
}
