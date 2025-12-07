namespace WatchStore.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(int userId, string email, List<string> roles);
        int? ValidateToken(string token);
    }
}
