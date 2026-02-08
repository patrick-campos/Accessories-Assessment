using Luxclusif.Backend.Application.Abstractions.Services;
using Microsoft.Extensions.Options;

namespace Luxclusif.Backend.Infrastructure.Services;

public sealed class GoogleDriveFileStorageService : IFileStorageService
{
    private readonly GoogleDriveOptions _options;

    public GoogleDriveFileStorageService(IOptions<GoogleDriveOptions> options)
    {
        _options = options.Value;
    }

    public async Task<FileStorageResult> SaveAsync(string fileName, string contentType, Stream content, DateTimeOffset ttl, CancellationToken cancellationToken)
    {
        var root = Path.Combine(AppContext.BaseDirectory, _options.UploadRoot);
        Directory.CreateDirectory(root);

        var externalId = Guid.NewGuid().ToString();
        var filePath = Path.Combine(root, $"{externalId}-{fileName}");

        await using var fileStream = File.Create(filePath);
        await content.CopyToAsync(fileStream, cancellationToken);

        return new FileStorageResult(_options.Provider, externalId, filePath);
    }

    public Task DeleteAsync(string externalId, string location, CancellationToken cancellationToken)
    {
        var filePath = location;
        if (!string.IsNullOrWhiteSpace(filePath) && File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        return Task.CompletedTask;
    }
}
