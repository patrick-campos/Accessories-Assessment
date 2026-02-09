using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Google.Apis.Upload;
using Luxclusif.Backend.Application.Abstractions.Services;
using Microsoft.Extensions.Options;

namespace Luxclusif.Backend.Infrastructure.Services;

public sealed class GoogleDriveFileStorageService : IFileStorageService
{
    private readonly GoogleDriveOptions _options;
    private readonly DriveService _driveService;

    public GoogleDriveFileStorageService(IOptions<GoogleDriveOptions> options, GoogleApiClientFactory clientFactory)
    {
        _options = options.Value;
        _driveService = clientFactory.CreateDriveService(_options);
    }

    public async Task<FileStorageResult> SaveAsync(string fileName, string contentType, Stream content, DateTimeOffset ttl, CancellationToken cancellationToken)
    {
        var fileMetadata = new Google.Apis.Drive.v3.Data.File
        {
            Name = fileName,
            Parents = string.IsNullOrWhiteSpace(_options.FolderId) ? null : new List<string> { _options.FolderId }
        };

        var request = _driveService.Files.Create(fileMetadata, content, contentType);
        request.Fields = "id";
        request.SupportsAllDrives = true;
        request.ChunkSize = ResumableUpload.MinimumChunkSize * 32;

        var uploadResult = await request.UploadAsync(cancellationToken);
        if (uploadResult.Exception is not null)
        {
            throw new InvalidOperationException($"Failed to upload file to Google Drive: {uploadResult.Exception.Message}");
        }

        var uploaded = request.ResponseBody;

        if (uploaded is null)
        {
            throw new InvalidOperationException("Failed to upload file to Google Drive: empty response.");
        }

        if (string.IsNullOrWhiteSpace(_options.FolderId))
        {
            await EnsurePublicReadAsync(uploaded.Id, cancellationToken);
        }

        var location = BuildThumbnailUrl(uploaded.Id);
        return new FileStorageResult(_options.Provider, uploaded.Id, location);
    }

    public Task DeleteAsync(string externalId, string location, CancellationToken cancellationToken)
    {
        var request = _driveService.Files.Delete(externalId);
        request.SupportsAllDrives = true;
        return request.ExecuteAsync(cancellationToken);
    }


    private async Task EnsurePublicReadAsync(string fileId, CancellationToken cancellationToken)
    {
        var permission = new Permission
        {
            Type = "anyone",
            Role = "reader"
        };

        var request = _driveService.Permissions.Create(permission, fileId);
        request.SupportsAllDrives = true;
        request.Fields = "id";
        await request.ExecuteAsync(cancellationToken);
    }

    private static string BuildThumbnailUrl(string fileId)
    {
        return $"https://drive.google.com/thumbnail?id={fileId}&sz=w1000";
    }

}
