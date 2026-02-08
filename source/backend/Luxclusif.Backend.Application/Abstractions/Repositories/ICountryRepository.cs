using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.Abstractions.Repositories;

public interface ICountryRepository
{
    Task<IReadOnlyCollection<Country>> GetAllAsync(CancellationToken cancellationToken);
    Task<bool> ExistsAsync(string isoCode, CancellationToken cancellationToken);
}
