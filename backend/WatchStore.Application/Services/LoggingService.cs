using Microsoft.Extensions.Logging;
using WatchStore.Application.Interfaces;

namespace WatchStore.Application.Services
{
    public class LoggingService : ILoggingService
    {
        private readonly ILogger<LoggingService> _logger;
        private static LoggingService? _instance;

        private LoggingService(ILogger<LoggingService> logger)
        {
            _logger = logger;
        }

        public static LoggingService GetInstance(ILogger<LoggingService> logger)
        {
            _instance ??= new LoggingService(logger);
            return _instance;
        }

        public void LogInformation(string message, params object[] args)
        {
            _logger.LogInformation(message, args);
        }

        public void LogWarning(string message, params object[] args)
        {
            _logger.LogWarning(message, args);
        }

        public void LogError(string message, Exception? exception = null, params object[] args)
        {
            if (exception != null)
            {
                _logger.LogError(exception, message, args);
            }
            else
            {
                _logger.LogError(message, args);
            }
        }

        public void LogDebug(string message, params object[] args)
        {
            _logger.LogDebug(message, args);
        }

        public void LogCritical(string message, Exception? exception = null, params object[] args)
        {
            if (exception != null)
            {
                _logger.LogCritical(exception, message, args);
            }
            else
            {
                _logger.LogCritical(message, args);
            }
        }
    }
}
