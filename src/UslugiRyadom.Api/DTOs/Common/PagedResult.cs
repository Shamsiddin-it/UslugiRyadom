namespace UslugiRyadom.Api.DTOs.Common;

public class PagedResult<T>
{
    public int PageNumber { get; init; }

    public int PageSize { get; init; }

    public int TotalCount { get; init; }

    public IReadOnlyCollection<T> Items { get; init; } = [];
}
