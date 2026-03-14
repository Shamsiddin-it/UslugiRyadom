namespace UslugiRyadom.Api.DTOs.Common;

public class PagedResponse<T>
{
    public bool Success { get; init; }

    public string Message { get; init; } = string.Empty;

    public PagedResult<T> Data { get; init; } = new();

    public static PagedResponse<T> Ok(PagedResult<T> data, string message = "Success")
        => new()
        {
            Success = true,
            Message = message,
            Data = data
        };
}
