using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.Abstractions.Repositories;

public interface IBrandRepository
{
    Task<IReadOnlyCollection<Brand>> GetByFiltersAsync(string categoryId, string countryIsoCode, bool hasAvailableBuyer, CancellationToken cancellationToken);
}
