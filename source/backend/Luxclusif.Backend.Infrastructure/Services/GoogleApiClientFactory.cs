using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;

namespace Luxclusif.Backend.Infrastructure.Services;

public sealed class GoogleApiClientFactory
{
    public DriveService CreateDriveService(GoogleDriveOptions options)
    {
        var credential = CreateCredential(options, [DriveService.ScopeConstants.DriveFile]);
        return new DriveService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = options.ApplicationName
        });
    }

    public SheetsService CreateSheetsService(GoogleDriveOptions options)
    {
        var credential = CreateCredential(options, [SheetsService.Scope.Spreadsheets]);
        return new SheetsService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = options.ApplicationName
        });
    }

    private static UserCredential CreateCredential(GoogleDriveOptions options, IReadOnlyCollection<string> scopes)
    {
        if (string.IsNullOrWhiteSpace(options.ClientId) ||
            string.IsNullOrWhiteSpace(options.ClientSecret) ||
            string.IsNullOrWhiteSpace(options.RefreshToken))
        {
            throw new InvalidOperationException("Google OAuth credentials are missing.");
        }

        var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = options.ClientId,
                ClientSecret = options.ClientSecret
            },
            Scopes = scopes
        });

        var token = new TokenResponse
        {
            RefreshToken = options.RefreshToken
        };

        return new UserCredential(flow, "user", token);
    }
}
