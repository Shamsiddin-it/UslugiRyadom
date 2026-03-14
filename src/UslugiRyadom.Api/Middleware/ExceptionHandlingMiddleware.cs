using System.Net;
using System.Text.Json;
using FluentValidation;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.Helpers;

namespace UslugiRyadom.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Unhandled exception occurred.");
            await HandleExceptionAsync(context, exception);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = exception switch
        {
            ValidationException validationException => new
            {
                StatusCode = (int)HttpStatusCode.BadRequest,
                Payload = ApiResponse<object>.Fail(
                    "Validation failed",
                    validationException.Errors
                        .GroupBy(x => x.PropertyName)
                        .ToDictionary(x => x.Key, x => x.Select(e => e.ErrorMessage).ToArray()))
            },
            AppException appException => new
            {
                StatusCode = (int)appException.StatusCode,
                Payload = ApiResponse<object>.Fail(appException.Message, appException.Errors)
            },
            _ => new
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Payload = ApiResponse<object>.Fail("An unexpected error occurred.")
            }
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = response.StatusCode;

        var json = JsonSerializer.Serialize(response.Payload, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
