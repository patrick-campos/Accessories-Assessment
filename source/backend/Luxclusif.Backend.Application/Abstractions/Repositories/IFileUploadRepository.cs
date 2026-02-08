using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.Abstractions.Repositories;

public interface IFileUploadRepository
{
    Task SaveAsync(FileUpload fileUpload, CancellationToken cancellationToken);
    Task<FileUpload?> GetByIdAsync(string id, CancellationToken cancellationToken);
    Task DeleteAsync(string id, CancellationToken cancellationToken);
}
