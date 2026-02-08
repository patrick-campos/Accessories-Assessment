using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.Abstractions.Services;

public interface ISpreadsheetService
{
    Task AppendQuoteAsync(Quote quote, CancellationToken cancellationToken);
}
