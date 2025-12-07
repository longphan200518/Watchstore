namespace WatchStore.Application.DTOs
{
  public class AdminUserDto
  {
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool EmailConfirmed { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public List<string> Roles { get; set; } = new();
  }

  public class UserAdminFilterDto
  {
    public string? SearchTerm { get; set; }
    public string? Role { get; set; }
    public bool? IsDeleted { get; set; }
  }

  public class UpdateUserRolesDto
  {
    public List<string> Roles { get; set; } = new();
  }

  public class UpdateUserStatusDto
  {
    public bool IsDeleted { get; set; }
  }
}
