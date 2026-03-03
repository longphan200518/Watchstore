namespace WatchStore.Application.Features.Auth.EmailMessages
{
    /// <summary>
    /// Base class cho tất cả email messages - Factory Method Pattern
    /// </summary>
    public abstract class EmailMessage
    {
        public string Subject { get; protected set; } = string.Empty;
        public string ToEmail { get; set; } = string.Empty;

        /// <summary>
        /// Factory Method - subclass sẽ implement để generate HTML body
        /// </summary>
        public abstract string GenerateBody();

        protected string GetCommonStyles()
        {
            return @"
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f4a460; padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
        .footer { text-align: center; padding-top: 20px; font-size: 12px; color: #666; }";
        }

        protected string GetFooter()
        {
            return @"
        <div class='footer'>
            <p>&copy; 2024 WatchStore. Tất cả quyền được bảo vệ.</p>
        </div>";
        }
    }
}
