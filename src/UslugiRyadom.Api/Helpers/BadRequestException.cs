using System.Net;

namespace UslugiRyadom.Api.Helpers;

public sealed class BadRequestException : AppException
{
    public BadRequestException(string message, IDictionary<string, string[]>? errors = null)
        : base(message, HttpStatusCode.BadRequest, errors)
    {
    }
}
