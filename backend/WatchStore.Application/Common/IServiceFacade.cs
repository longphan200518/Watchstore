using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Common
{
    /// <summary>
    /// Facade Pattern - Đơn giản hóa việc inject nhiều dependencies vào services
    /// </summary>
    public interface IServiceFacade
    {
        // Core Infrastructure
        IUnitOfWork UnitOfWork { get; }
        IMemoryCache Cache { get; }
        IConfiguration Configuration { get; }

        // Identity
        UserManager<User> UserManager { get; }
        SignInManager<User> SignInManager { get; }
        RoleManager<Role> RoleManager { get; }

        // Application Services
        IJwtService JwtService { get; }
        IEmailService EmailService { get; }
        ILoggingService LoggingService { get; }

        // Generic Logger Factory
        ILogger<T> GetLogger<T>();
    }
}
