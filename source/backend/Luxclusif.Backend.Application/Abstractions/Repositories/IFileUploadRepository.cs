using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.Abstractions.Repositories;

public interface IFileUploadRepository
{
    Task SaveAsync(FileUpload fileUpload, CancellationToken cancellationToken);
}
