using Microsoft.AspNetCore.Identity;
namespace WatchStore.Domain.Entities
{
    public class User : IdentityUser<int>
    {
        public string FullName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
        public DateTime? EmailConfirmedAt { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpiry { get; set; }
        // Navigation properties
        public virtual ICollection<Watch> Watches { get; set; } = new List<Watch>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
