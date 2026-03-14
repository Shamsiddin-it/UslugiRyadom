using System.Net;

namespace UslugiRyadom.Api.Helpers;

public class AppException : Exception
{
    public AppException(string message, HttpStatusCode statusCode, IDictionary<string, string[]>? errors = null)
        : base(message)
    {
        StatusCode = statusCode;
        Errors = errors;
    }

    public HttpStatusCode StatusCode { get; }

    public IDictionary<string, string[]>? Errors { get; }
}
