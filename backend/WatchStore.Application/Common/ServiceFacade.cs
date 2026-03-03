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
    /// Facade Pattern Implementation - Gom tất cả common dependencies
    /// </summary>
    public class ServiceFacade : IServiceFacade
    {
        public IUnitOfWork UnitOfWork { get; }
        public IMemoryCache Cache { get; }
        public IConfiguration Configuration { get; }
        public UserManager<User> UserManager { get; }
        public SignInManager<User> SignInManager { get; }
        public RoleManager<Role> RoleManager { get; }
        public IJwtService JwtService { get; }
        public IEmailService EmailService { get; }
        public ILoggingService LoggingService { get; }

        private readonly ILoggerFactory _loggerFactory;

        public ServiceFacade(
            IUnitOfWork unitOfWork,
            IMemoryCache cache,
            IConfiguration configuration,
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            RoleManager<Role> roleManager,
            IJwtService jwtService,
            IEmailService emailService,
            ILoggingService loggingService,
            ILoggerFactory loggerFactory)
        {
            UnitOfWork = unitOfWork;
            Cache = cache;
            Configuration = configuration;
            UserManager = userManager;
            SignInManager = signInManager;
            RoleManager = roleManager;
            JwtService = jwtService;
            EmailService = emailService;
            LoggingService = loggingService;
            _loggerFactory = loggerFactory;
        }

        public ILogger<T> GetLogger<T>()
        {
            return _loggerFactory.CreateLogger<T>();
        }
    }
}
