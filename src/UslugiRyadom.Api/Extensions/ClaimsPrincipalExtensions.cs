using System.Security.Claims;
using UslugiRyadom.Api.Helpers;

namespace UslugiRyadom.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(value, out var userId)
            ? userId
            : throw new UnauthorizedAppException("User context is invalid.");
    }
}
