namespace WatchStore.Application.Features.Auth.EmailMessages
{
    /// <summary>
    /// Factory Method Pattern - Email Message Factory
    /// </summary>
    public class EmailMessageFactory
    {
        public static VerificationEmail CreateVerificationEmail(string toEmail, string otp)
        {
            return new VerificationEmail(toEmail, otp);
        }

        public static PasswordResetEmail CreatePasswordResetEmail(string toEmail, string otp)
        {
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
            return new OrderStatusUpdateEmail(toEmail, customerName, orderId, newStatus);
        }
    }
}
