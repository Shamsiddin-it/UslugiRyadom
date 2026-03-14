using System.Net;

namespace UslugiRyadom.Api.Helpers;

public sealed class ForbiddenException : AppException
{
    public ForbiddenException(string message)
        : base(message, HttpStatusCode.Forbidden)
    {
    }
}
