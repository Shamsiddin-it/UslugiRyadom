using System.Net;

namespace UslugiRyadom.Api.Helpers;

public sealed class NotFoundException : AppException
{
    public NotFoundException(string message)
        : base(message, HttpStatusCode.NotFound)
    {
    }
}
