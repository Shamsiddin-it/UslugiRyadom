using Microsoft.EntityFrameworkCore;
using UslugiRyadom.Api.Data;
using UslugiRyadom.Api.DTOs.Common;

namespace UslugiRyadom.Api.Middleware;

public class BlockedUserMiddleware
{
    private readonly RequestDelegate _next;

    public BlockedUserMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var userIdClaim = context.User.Claims.FirstOrDefault(x => x.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userIdClaim, out var userId))
            {
                var isBlocked = await dbContext.Users.AsNoTracking().AnyAsync(x => x.Id == userId && x.IsBlocked, context.RequestAborted);
                if (isBlocked)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsJsonAsync(ApiResponse<object>.Fail("User is blocked."), context.RequestAborted);
                    return;
                }
            }
        }

        await _next(context);
    }
}
