using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Abstractions.Services;
using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Application.UseCases.Quotes;

public sealed class SaveQuote
{
    private readonly ICountryRepository _countryRepository;
    private readonly IFileUploadRepository _fileUploadRepository;
    private readonly IQuoteRepository _quoteRepository;
    private readonly ISpreadsheetService _spreadsheetService;
    private readonly IUnitOfWork _unitOfWork;

    public SaveQuote(
        ICountryRepository countryRepository,
        IFileUploadRepository fileUploadRepository,
        IQuoteRepository quoteRepository,
        ISpreadsheetService spreadsheetService,
        IUnitOfWork unitOfWork)
    {
        _countryRepository = countryRepository;
        _fileUploadRepository = fileUploadRepository;
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

        var customer = BuildCustomer(request.CustomerInformation);
        var items = await BuildItemsAsync(request.Items, cancellationToken);
        var quote = new Quote(
            Guid.NewGuid().ToString(),
            request.CountryOfOrigin,
            customer,
            items);

        await PersistQuoteAsync(quote, cancellationToken);

        return new QuoteResponse(quote.Id);
    }

    public async Task<QuoteBatchResponse> ExecuteBatchAsync(QuoteRequestDto request, CancellationToken cancellationToken)
    {
        if (!await _countryRepository.ExistsAsync(request.CountryOfOrigin, cancellationToken))
        {
            throw new InvalidOperationException("Country of origin does not exist.");
        }

        var customer = BuildCustomer(request.CustomerInformation);
        var quoteIds = new List<string>();

        foreach (var item in request.Items)
        {
            var items = await BuildItemsAsync(new List<QuoteItemDto> { item }, cancellationToken);
            var quote = new Quote(
                Guid.NewGuid().ToString(),
                request.CountryOfOrigin,
                customer,
                items);

            await PersistQuoteAsync(quote, cancellationToken);
            quoteIds.Add(quote.Id);
        }

        return new QuoteBatchResponse(quoteIds);
    }

    private static Customer BuildCustomer(CustomerInformationDto customer)
    {
        return new Customer(
            customer.ExternalSellerTier,
            customer.FirstName,
            customer.LastName,
            customer.Email);
    }

    private async Task<List<Item>> BuildItemsAsync(IReadOnlyCollection<QuoteItemDto> items, CancellationToken cancellationToken)
    {
        var result = new List<Item>();

        foreach (var item in items)
        {
            var attributes = item.Attributes.Select(attribute => new ItemAttribute(
                attribute.Id,
                attribute.Values.Select(value => new ItemAttributeValue(value.Id, value.Label)).ToList()
            )).ToList();

            var files = new List<ItemFile>();
            foreach (var file in item.Files)
            {
                files.Add(await BuildItemFileAsync(file, cancellationToken));
            }

            result.Add(new Item(
                item.CategoryId,
                item.BrandId,
                item.Model,
                item.Description,
                attributes,
                files));
        }

        return result;
    }

    private async Task PersistQuoteAsync(Quote quote, CancellationToken cancellationToken)
    {
        await _unitOfWork.ExecuteAsync(async ct =>
        {
            await _quoteRepository.SaveAsync(quote, ct);
            await _spreadsheetService.AppendQuoteAsync(quote, ct);
        }, cancellationToken);
    }

    private async Task<ItemFile> BuildItemFileAsync(QuoteItemFileDto file, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(file.Location))
        {
            return new ItemFile(
                file.Type,
                file.Provider,
                file.ExternalId,
                file.Location,
                new FileMetadata(file.Metadata.PhotoType, file.Metadata.PhotoSubtype, file.Metadata.Description));
        }

        var uploaded = await _fileUploadRepository.GetByIdAsync(file.ExternalId, cancellationToken);
        if (uploaded is null)
        {
            return new ItemFile(
                file.Type,
                file.Provider,
                file.ExternalId,
                file.Location,
                new FileMetadata(file.Metadata.PhotoType, file.Metadata.PhotoSubtype, file.Metadata.Description));
        }

        return new ItemFile(
            file.Type,
            uploaded.Provider,
            uploaded.ExternalId,
            uploaded.Location,
            new FileMetadata(file.Metadata.PhotoType, file.Metadata.PhotoSubtype, file.Metadata.Description));
    }
}
