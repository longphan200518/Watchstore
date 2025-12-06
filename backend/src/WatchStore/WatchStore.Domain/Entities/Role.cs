using Microsoft.AspNetCore.Identity;
namespace WatchStore.Domain.Entities
{
    public class Role : IdentityRole<int>
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
