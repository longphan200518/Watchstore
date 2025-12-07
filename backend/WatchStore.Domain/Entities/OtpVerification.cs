namespace WatchStore.Domain.Entities
{
  public class OtpVerification : BaseEntity
  {
    public string Email { get; set; } = string.Empty;
    public string Otp { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public int Attempts { get; set; } = 0;
    public int MaxAttempts { get; set; } = 5;
    public bool IsVerified { get; set; } = false;
    public string Type { get; set; } = "email_verification"; // email_verification, password_reset
  }
}
