using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Abstractions.Services;

namespace Luxclusif.Backend.Application.UseCases.Files;

public sealed class DeleteFile
{
    private readonly IFileStorageService _fileStorageService;
    private readonly IFileUploadRepository _fileUploadRepository;

    public DeleteFile(IFileStorageService fileStorageService, IFileUploadRepository fileUploadRepository)
    {
        _fileStorageService = fileStorageService;
        _fileUploadRepository = fileUploadRepository;
    }

    public async Task ExecuteAsync(string id, CancellationToken cancellationToken)
    {
        var fileUpload = await _fileUploadRepository.GetByIdAsync(id, cancellationToken);
        if (fileUpload is null)
        {
            throw new InvalidOperationException("File not found.");
        }

        await _fileStorageService.DeleteAsync(fileUpload.ExternalId, fileUpload.Location, cancellationToken);
        await _fileUploadRepository.DeleteAsync(id, cancellationToken);
    }
}
