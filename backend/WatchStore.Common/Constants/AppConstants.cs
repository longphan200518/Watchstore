namespace WatchStore.Common.Constants
{
    /// <summary>
    /// Application-wide constants
    /// </summary>
    public static class AppConstants
    {
        public static class Roles
        {
            public const string Admin = "Admin";
            public const string User = "User";
        }

        public static class CacheKeys
        {
            public const string AllBrands = "all_brands";
            public const string BrandPrefix = "brand_";
            public const string WatchPrefix = "watch_";
            public const string PopularWatches = "popular_watches";

            public static string GetBrandKey(int id) => $"{BrandPrefix}{id}";
            public static string GetWatchKey(int id) => $"{WatchPrefix}{id}";
        }

        public static class CacheDuration
        {
            public const int ShortMinutes = 5;
            public const int MediumMinutes = 15;
            public const int LongMinutes = 60;
        }

        public static class Pagination
        {
            public const int DefaultPageNumber = 1;
            public const int DefaultPageSize = 10;
            public const int MaxPageSize = 100;
        }

        public static class Messages
        {
            public const string Success = "Operation completed successfully";
            public const string NotFound = "Resource not found";
            public const string Unauthorized = "Unauthorized access";
            public const string BadRequest = "Invalid request";
            public const string InternalError = "An error occurred while processing your request";
        }
    }
}
