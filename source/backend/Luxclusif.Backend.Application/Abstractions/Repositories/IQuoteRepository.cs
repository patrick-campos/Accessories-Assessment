using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.Abstractions.Repositories;

public interface IQuoteRepository
{
    Task SaveAsync(Quote quote, CancellationToken cancellationToken);
    Task<PagedQuoteList> GetAllAsync(int page, int pageSize, CancellationToken cancellationToken);
}
