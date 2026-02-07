namespace Luxclusif.Backend.Application.Dtos;

public sealed record ListResponse<T>(IReadOnlyCollection<T> Items);

public sealed record EntriesResponse<T>(IReadOnlyCollection<T> Entries);
