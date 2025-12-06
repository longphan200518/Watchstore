namespace WatchStore.Common.Extensions
{
    /// <summary>
    /// String extension methods
    /// </summary>
    public static class StringExtensions
    {
        public static bool IsNullOrEmpty(this string? value)
        {
            return string.IsNullOrWhiteSpace(value);
        }

        public static string ToSnakeCase(this string text)
        {
            if (string.IsNullOrEmpty(text))
                return text;

            var result = string.Concat(
                text.Select((c, i) => i > 0 && char.IsUpper(c)
                    ? "_" + c.ToString()
                    : c.ToString())).ToLower();

            return result;
        }

        public static string Truncate(this string value, int maxLength)
        {
            if (string.IsNullOrEmpty(value)) return value;
            return value.Length <= maxLength ? value : value.Substring(0, maxLength);
        }
    }
}
