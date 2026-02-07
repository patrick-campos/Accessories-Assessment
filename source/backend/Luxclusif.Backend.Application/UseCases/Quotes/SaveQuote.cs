using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Abstractions.Services;
using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.UseCases.Quotes;

public sealed class SaveQuote
{
    private readonly ICountryRepository _countryRepository;
    private readonly IQuoteRepository _quoteRepository;
    private readonly ISpreadsheetService _spreadsheetService;
    private readonly IUnitOfWork _unitOfWork;

    public SaveQuote(
        ICountryRepository countryRepository,
        IQuoteRepository quoteRepository,
        ISpreadsheetService spreadsheetService,
        IUnitOfWork unitOfWork)
    {
        _countryRepository = countryRepository;
        _quoteRepository = quoteRepository;
        _spreadsheetService = spreadsheetService;
        _unitOfWork = unitOfWork;
    }

    public async Task<QuoteResponse> ExecuteAsync(QuoteRequestDto request, CancellationToken cancellationToken)
    {
        if (!await _countryRepository.ExistsAsync(request.CountryOfOrigin, cancellationToken))
        {
            throw new InvalidOperationException("Country of origin does not exist.");
        }

        var customer = new Customer(
            request.CustomerInformation.ExternalSellerTier,
            request.CustomerInformation.FirstName,
            request.CustomerInformation.LastName,
            request.CustomerInformation.Email);

        var items = request.Items.Select(item => new Item(
            item.CategoryId,
            item.BrandId,
            item.Model,
            item.Description,
            item.Attributes.Select(attribute => new ItemAttribute(
                attribute.Id,
                attribute.Values.Select(value => new ItemAttributeValue(value.Id, value.Label)).ToList()
            )).ToList(),
            item.Files.Select(file => new ItemFile(
                file.Type,
                file.Provider,
                file.ExternalId,
                file.Location,
                new FileMetadata(file.Metadata.PhotoType, file.Metadata.PhotoSubtype, file.Metadata.Description)
            )).ToList()
        )).ToList();

        var quote = new Quote(
            Guid.NewGuid().ToString(),
            request.CountryOfOrigin,
            customer,
            items);

        await _unitOfWork.ExecuteAsync(async ct =>
        {
            await _quoteRepository.SaveAsync(quote, ct);
            await _spreadsheetService.AppendQuoteAsync(quote, ct);
        }, cancellationToken);

        return new QuoteResponse(quote.Id);
    }
}
