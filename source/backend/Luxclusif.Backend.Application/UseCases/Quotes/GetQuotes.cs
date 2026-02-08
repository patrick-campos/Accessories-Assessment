using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Dtos;

namespace Luxclusif.Backend.Application.UseCases.Quotes;

public sealed class GetQuotes
{
    private readonly IQuoteRepository _quoteRepository;

    public GetQuotes(IQuoteRepository quoteRepository)
    {
        _quoteRepository = quoteRepository;
    }

    public async Task<QuoteListResponseDto> ExecuteAsync(int pageNumber, CancellationToken cancellationToken)
    {
        var safePage = pageNumber < 1 ? 1 : pageNumber;
        const int safePageSize = 5;

        var result = await _quoteRepository.GetAllAsync(safePage, safePageSize, cancellationToken);
        var totalPages = result.TotalItems == 0 ? 1 : (int)Math.Ceiling(result.TotalItems / (double)safePageSize);

        return new QuoteListResponseDto(
            safePage,
            totalPages,
            result.TotalItems,
            safePageSize,
            result.Items);
    }
}
