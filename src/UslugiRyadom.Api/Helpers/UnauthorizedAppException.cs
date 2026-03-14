using System.Net;

namespace UslugiRyadom.Api.Helpers;

public sealed class UnauthorizedAppException : AppException
{
    public UnauthorizedAppException(string message)
        : base(message, HttpStatusCode.Unauthorized)
    {
    }
}
