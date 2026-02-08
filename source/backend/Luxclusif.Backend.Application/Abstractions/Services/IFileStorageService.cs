namespace Luxclusif.Backend.Application.Abstractions.Services;

public sealed record FileStorageResult(string Provider, string ExternalId, string Location);

public interface IFileStorageService
{
    Task<FileStorageResult> SaveAsync(string fileName, string contentType, Stream content, DateTimeOffset ttl, CancellationToken cancellationToken);
    Task DeleteAsync(string externalId, string location, CancellationToken cancellationToken);
}
