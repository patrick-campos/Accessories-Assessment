using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Google.Apis.Services;
using Luxclusif.Backend.Application.Abstractions.Services;
using Microsoft.Extensions.Options;

namespace Luxclusif.Backend.Infrastructure.Services;

public sealed class GoogleDriveFileStorageService : IFileStorageService
{
    private readonly GoogleDriveOptions _options;
    private readonly DriveService _driveService;

    public GoogleDriveFileStorageService(IOptions<GoogleDriveOptions> options)
    {
        _options = options.Value;
        _driveService = CreateDriveService(_options);
    }

    public async Task<FileStorageResult> SaveAsync(string fileName, string contentType, Stream content, DateTimeOffset ttl, CancellationToken cancellationToken)
    {
        var fileMetadata = new Google.Apis.Drive.v3.Data.File
        {
            Name = fileName,
            Parents = string.IsNullOrWhiteSpace(_options.FolderId) ? null : new List<string> { _options.FolderId }
        };

        var request = _driveService.Files.Create(fileMetadata, content, contentType);
        request.Fields = "id, webViewLink, webContentLink";
        request.SupportsAllDrives = true;

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

        await EnsurePublicReadAsync(uploaded.Id, cancellationToken);

        var fileInfo = await GetFileInfoAsync(uploaded.Id, cancellationToken);
        var location = ResolvePublicLocation(uploaded.Id, fileInfo);

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

    private async Task<Google.Apis.Drive.v3.Data.File?> GetFileInfoAsync(string fileId, CancellationToken cancellationToken)
    {
        var request = _driveService.Files.Get(fileId);
        request.Fields = "id, webViewLink, webContentLink";
        request.SupportsAllDrives = true;
        return await request.ExecuteAsync(cancellationToken);
    }

    private static string ResolvePublicLocation(string fileId, Google.Apis.Drive.v3.Data.File? fileInfo)
    {
        if (fileInfo is not null)
        {
            if (!string.IsNullOrWhiteSpace(fileInfo.WebContentLink))
            {
                return fileInfo.WebContentLink;
            }

            if (!string.IsNullOrWhiteSpace(fileInfo.WebViewLink))
            {
                return fileInfo.WebViewLink;
            }
        }

        return $"https://drive.usercontent.google.com/download?id={fileId}&export=view";
    }

    private static DriveService CreateDriveService(GoogleDriveOptions options)
    {
        if (string.IsNullOrWhiteSpace(options.ClientId) ||
            string.IsNullOrWhiteSpace(options.ClientSecret) ||
            string.IsNullOrWhiteSpace(options.RefreshToken))
        {
            throw new InvalidOperationException("GoogleDrive OAuth credentials are missing.");
        }

        var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = options.ClientId,
                ClientSecret = options.ClientSecret
            },
            Scopes = [DriveService.ScopeConstants.DriveFile]
        });

        var token = new TokenResponse
        {
            RefreshToken = options.RefreshToken
        };

        var credential = new UserCredential(flow, "user", token);

        return new DriveService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = options.ApplicationName
        });
    }
}
