using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.Abstractions.Repositories;

public interface ICategoryRepository
{
    Task<IReadOnlyCollection<Category>> GetByFiltersAsync(string countryIsoCode, bool hasAvailableBuyer, CancellationToken cancellationToken);
}
