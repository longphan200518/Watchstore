using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Common
{
    /// <summary>
    /// Base service class with common functionality
    /// </summary>
    public abstract class BaseService
    {
        protected readonly IUnitOfWork UnitOfWork;
        protected readonly IMemoryCache Cache;
        protected readonly ILogger Logger;

        protected BaseService(
            IUnitOfWork unitOfWork,
            IMemoryCache cache,
            ILogger logger)
        {
            UnitOfWork = unitOfWork;
            Cache = cache;
            Logger = logger;
        }

        /// <summary>
        /// Execute with caching
        /// </summary>
        protected async Task<T?> ExecuteWithCache<T>(
            string cacheKey,
            Func<Task<T>> fetchFunc,
            int cacheMinutes = 15)
        {
            if (Cache.TryGetValue(cacheKey, out T? cachedValue))
            {
                Logger.LogInformation("Cache hit for key: {CacheKey}", cacheKey);
                return cachedValue;
            }

            Logger.LogInformation("Cache miss for key: {CacheKey}", cacheKey);
            var value = await fetchFunc();

            if (value != null)
            {
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(cacheMinutes));

                Cache.Set(cacheKey, value, cacheOptions);
            }

            return value;
        }

        /// <summary>
        /// Invalidate cache
        /// </summary>
        protected void InvalidateCache(string cacheKey)
        {
            Cache.Remove(cacheKey);
            Logger.LogInformation("Cache invalidated for key: {CacheKey}", cacheKey);
        }

        /// <summary>
        /// Invalidate multiple cache keys by pattern
        /// </summary>
        protected void InvalidateCacheByPattern(string pattern)
        {
            // Note: MemoryCache doesn't support pattern-based removal natively
            // For production, consider using Redis with SCAN command
            Logger.LogWarning("Pattern-based cache invalidation not implemented for MemoryCache. Pattern: {Pattern}", pattern);
        }

        /// <summary>
        /// Execute operation with transaction
        /// </summary>
        protected async Task<ApiResponse<T>> ExecuteInTransaction<T>(
            Func<Task<ApiResponse<T>>> operation,
            string operationName)
        {
            try
            {
                await UnitOfWork.BeginTransactionAsync();
                Logger.LogInformation("Starting transaction for: {Operation}", operationName);

                var result = await operation();

                if (result.Success)
                {
                    await UnitOfWork.CommitAsync();
                    Logger.LogInformation("Transaction committed for: {Operation}", operationName);
                }
                else
                {
                    await UnitOfWork.RollbackAsync();
                    Logger.LogWarning("Transaction rolled back for: {Operation}", operationName);
                }

                return result;
            }
            catch (Exception ex)
            {
                await UnitOfWork.RollbackAsync();
                Logger.LogError(ex, "Transaction failed for: {Operation}", operationName);
                return ApiResponse<T>.ErrorResponse($"Operation failed: {ex.Message}");
            }
        }

        /// <summary>
        /// Log and return error response
        /// </summary>
        protected ApiResponse<T> LogAndReturnError<T>(string message, Exception? ex = null)
        {
            if (ex != null)
            {
                Logger.LogError(ex, message);
                return ApiResponse<T>.ErrorResponse(message, new List<string> { ex.Message });
            }

            Logger.LogWarning(message);
            return ApiResponse<T>.ErrorResponse(message);
        }
    }
}
