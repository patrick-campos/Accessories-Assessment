using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Abstractions.Services;
using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.UseCases.Files;

public sealed class SaveFile
{
    private readonly IFileStorageService _fileStorageService;
    private readonly IFileUploadRepository _fileUploadRepository;
    private readonly IClock _clock;

    public SaveFile(IFileStorageService fileStorageService, IFileUploadRepository fileUploadRepository, IClock clock)
    {
        _fileStorageService = fileStorageService;
        _fileUploadRepository = fileUploadRepository;
        _clock = clock;
    }

    public async Task<FileUploadResponse> ExecuteAsync(FileUploadRequest request, CancellationToken cancellationToken)
    {
        var ttl = _clock.UtcNow.AddDays(1);
        var storageResult = await _fileStorageService.SaveAsync(
            request.FileName,
            request.ContentType,
            request.Content,
            ttl,
            cancellationToken);

        var fileUpload = new FileUpload(
            Guid.NewGuid().ToString(),
            storageResult.Provider,
            storageResult.ExternalId,
            storageResult.Location,
            new FileMetadata("None", "None", string.Empty));

        await _fileUploadRepository.SaveAsync(fileUpload, cancellationToken);

        return new FileUploadResponse(fileUpload.Id);
    }
}
