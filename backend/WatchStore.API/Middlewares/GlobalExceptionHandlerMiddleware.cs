using System.Net;
using System.Text.Json;
using WatchStore.Application.Common;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Middlewares
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILoggingService _loggingService;
        private readonly IHostEnvironment _env;

        public GlobalExceptionHandlerMiddleware(
            RequestDelegate next,
            ILoggingService loggingService,
            IHostEnvironment env)
        {
            _next = next;
            _loggingService = loggingService;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _loggingService.LogError("An unhandled exception occurred", ex);
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = ApiResponse<object>.ErrorResponse(
                "An error occurred while processing your request",
                _env.IsDevelopment() ? new List<string> { exception.Message, exception.StackTrace ?? "" } : null
            );

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
        }
    }
}
