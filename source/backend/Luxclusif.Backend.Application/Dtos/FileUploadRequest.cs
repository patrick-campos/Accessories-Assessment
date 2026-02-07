namespace Luxclusif.Backend.Application.Dtos;

public sealed record FileUploadRequest(string FileName, string ContentType, Stream Content);
