namespace zocoCrm2026Back.Application.Dtos;

public record PagedResponse<T>(
    List<T> Items,
    int TotalItems,
    int Page,
    int PageSize,
    int TotalPages
);
