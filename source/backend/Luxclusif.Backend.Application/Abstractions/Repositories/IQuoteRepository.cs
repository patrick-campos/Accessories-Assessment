using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.Abstractions.Repositories;

public interface IQuoteRepository
{
    Task SaveAsync(Quote quote, CancellationToken cancellationToken);
}
