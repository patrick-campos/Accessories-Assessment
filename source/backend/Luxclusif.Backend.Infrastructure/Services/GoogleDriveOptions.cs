namespace Luxclusif.Backend.Infrastructure.Services;

public sealed class GoogleDriveOptions
{
    public string Provider { get; set; } = "GoogleDrive";
    public string UploadRoot { get; set; } = "Uploads";
    public string FolderId { get; set; } = string.Empty;
    public string ApplicationName { get; set; } = "Luxclusif";
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
