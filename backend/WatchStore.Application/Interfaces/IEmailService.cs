namespace WatchStore.Application.Interfaces
{
  public interface IEmailService
  {
    Task<bool> SendVerificationEmailAsync(string email, string otp);
    Task<bool> SendPasswordResetEmailAsync(string email, string otp);
  }
}
