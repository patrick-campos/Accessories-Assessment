using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.Abstractions.Repositories;

public interface IAttributeRepository
{
    Task<IReadOnlyCollection<CategoryAttribute>> GetByCategoryIdAsync(string categoryId, CancellationToken cancellationToken);
}
