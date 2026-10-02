using System.Net;
using System.Text.Json;
using zocoCrm2026Back.Application.Exceptions;

namespace zocoCrm2026Back.Api.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ocurrió una excepción no controlada");
            context.Response.ContentType = "application/json";

            context.Response.StatusCode = ex switch
            {
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                ArgumentException => (int)HttpStatusCode.BadRequest,
                DuplicatedEntityException => (int)HttpStatusCode.Conflict,
                ValidationException => (int)HttpStatusCode.BadRequest,
                _ => (int)HttpStatusCode.InternalServerError
            };

            object response = ex switch
            {
                ValidationException ve => new { errores = ve.Errors },
                _ => new { error = ex.Message }
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}