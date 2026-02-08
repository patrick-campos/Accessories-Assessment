using Dapper;
using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Domain.Entities;
using Luxclusif.Backend.Infrastructure.Commands;
using Luxclusif.Backend.Infrastructure.Database;
using Npgsql;

namespace Luxclusif.Backend.Infrastructure.Repositories;

public sealed class QuoteRepository : RepositoryBase, IQuoteRepository
{
    private readonly NpgsqlConnectionFactory _connectionFactory;

    public QuoteRepository(NpgsqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task SaveAsync(Quote quote, CancellationToken cancellationToken)
    {
        var (connection, transaction, shouldDispose) = await GetSessionAsync(_connectionFactory, cancellationToken);
        try
        {
            await connection.ExecuteAsync(
                QuoteCommands.InsertQuote,
                new
                {
                    quote.Id,
                    quote.CountryOfOriginIsoCode,
                    CreatedAt = quote.CreatedAt
                },
                transaction);

            var customerId = Guid.NewGuid().ToString();
            await connection.ExecuteAsync(
                QuoteCommands.InsertCustomer,
                new
                {
                    Id = customerId,
                    QuoteId = quote.Id,
                    quote.Customer.ExternalSellerTier,
                    quote.Customer.FirstName,
                    quote.Customer.LastName,
                    quote.Customer.Email
                },
                transaction);

            foreach (var item in quote.Items)
            {
                var itemId = Guid.NewGuid().ToString();
                await connection.ExecuteAsync(
                    QuoteCommands.InsertItem,
                    new
                    {
                        Id = itemId,
                        QuoteId = quote.Id,
                        item.CategoryId,
                        item.BrandId,
                        item.Model,
                        item.Description
                    },
                    transaction);

                foreach (var attribute in item.Attributes)
                {
                    var itemAttributeId = Guid.NewGuid().ToString();
                    await connection.ExecuteAsync(
                        QuoteCommands.InsertItemAttribute,
                        new
                        {
                            Id = itemAttributeId,
                            ItemId = itemId,
                            AttributeId = attribute.AttributeId
                        },
                        transaction);

                    foreach (var value in attribute.Values)
                    {
                        await connection.ExecuteAsync(
                            QuoteCommands.InsertItemAttributeValue,
                            new
                            {
                                Id = Guid.NewGuid().ToString(),
                                ItemAttributeId = itemAttributeId,
                                ValueId = value.Id,
                                value.Label
                            },
                            transaction);
                    }
                }

                foreach (var file in item.Files)
                {
                    await connection.ExecuteAsync(
                        QuoteCommands.InsertItemFile,
                        new
                        {
                            Id = Guid.NewGuid().ToString(),
                            ItemId = itemId,
                            file.Type,
                            file.Provider,
                            file.ExternalId,
                            file.Location,
                            PhotoType = file.Metadata.PhotoType,
                            PhotoSubtype = file.Metadata.PhotoSubtype,
                            Description = file.Metadata.Description
                        },
                        transaction);
                }
            }
        }
        finally
        {
            if (shouldDispose)
            {
                await connection.DisposeAsync();
            }
        }
    }

    public async Task<PagedQuoteList> GetAllAsync(int page, int pageSize, CancellationToken cancellationToken)
    {
        var (connection, transaction, shouldDispose) = await GetSessionAsync(_connectionFactory, cancellationToken);
        try
        {
            var totalItems = await GetTotalQuotesAsync(connection, transaction);
            var quotes = await GetQuotesPageAsync(connection, transaction, page, pageSize);

            if (quotes.Count == 0)
            {
                return new PagedQuoteList(totalItems, Array.Empty<QuoteListItemDto>());
            }

            var details = await GetQuoteDetailsAsync(connection, transaction, quotes);
            var lookups = BuildLookups(quotes, details);
            var itemsByQuote = BuildQuoteItems(details, lookups);
            var resultItems = BuildQuoteDtos(quotes, lookups, itemsByQuote);

            return new PagedQuoteList(totalItems, resultItems);
        }
        finally
        {
            if (shouldDispose)
            {
                await connection.DisposeAsync();
            }
        }
    }

    private static string BuildReference(Guid quoteId)
    {
        var raw = quoteId.ToString("N").ToUpperInvariant();
        return raw.Length > 8 ? raw[..8] : raw;
    }

    private static string ResolveCurrency(string countryIsoCode)
    {
        return countryIsoCode.ToUpperInvariant() switch
        {
            "GB" => "GBP",
            "PT" => "EUR",
            "ES" => "EUR",
            "FR" => "EUR",
            "US" => "USD",
            _ => "USD"
        };
    }

    private static async Task<int> GetTotalQuotesAsync(
        NpgsqlConnection connection,
        NpgsqlTransaction? transaction)
    {
        return await connection.ExecuteScalarAsync<int>(
            QuoteQueryCommands.CountQuotes,
            transaction: transaction);
    }

    private static async Task<List<QuoteRow>> GetQuotesPageAsync(
        NpgsqlConnection connection,
        NpgsqlTransaction? transaction,
        int page,
        int pageSize)
    {
        var offset = (page - 1) * pageSize;
        var quotes = await connection.QueryAsync<QuoteRow>(
            QuoteQueryCommands.SelectQuotesPage,
            new { Offset = offset, Limit = pageSize },
            transaction);
        return quotes.ToList();
    }

    private static async Task<QuoteDetails> GetQuoteDetailsAsync(
        NpgsqlConnection connection,
        NpgsqlTransaction? transaction,
        IReadOnlyCollection<QuoteRow> quotes)
    {
        var quoteIds = quotes.Select(quote => quote.Id).ToArray();
        var multi = await connection.QueryMultipleAsync(
            QuoteQueryCommands.SelectQuoteDetails,
            new { QuoteIds = quoteIds },
            transaction);

        var customers = (await multi.ReadAsync<CustomerRow>()).ToList();
        var items = (await multi.ReadAsync<ItemRow>()).ToList();
        var itemAttributes = (await multi.ReadAsync<ItemAttributeRow>()).ToList();
        var attributeValues = (await multi.ReadAsync<ItemAttributeValueRow>()).ToList();
        var files = (await multi.ReadAsync<ItemFileRow>()).ToList();
        var categories = (await multi.ReadAsync<LookupRow>()).ToList();
        var brands = (await multi.ReadAsync<LookupRow>()).ToList();

        return new QuoteDetails(customers, items, itemAttributes, attributeValues, files, categories, brands);
    }

    private static QuoteLookups BuildLookups(
        IReadOnlyCollection<QuoteRow> quotes,
        QuoteDetails details)
    {
        var categoryLookup = details.Categories
            .GroupBy(entry => entry.Id)
            .ToDictionary(group => group.Key, group => group.First().Name);
        var brandLookup = details.Brands
            .GroupBy(entry => entry.Id)
            .ToDictionary(group => group.Key, group => group.First().Name);
        var customerLookup = details.Customers
            .GroupBy(entry => entry.QuoteId)
            .ToDictionary(group => group.Key, group => group.First());
        var quoteLookup = quotes.ToDictionary(quote => quote.Id);

        var attributeValueLookup = details.AttributeValues
            .GroupBy(value => value.ItemAttributeId)
            .ToDictionary(group => group.Key, group => group
                .Select(value => new QuoteListAttributeValueDto(value.ValueId.ToString(), value.Label))
                .ToList());

        var attributeLookup = details.ItemAttributes
            .GroupBy(attribute => attribute.ItemId)
            .ToDictionary(group => group.Key, group => group
                .Select(attribute => new QuoteListAttributeDto(
                    attribute.AttributeId.ToString(),
                    attribute.AttributeName,
                    attributeValueLookup.TryGetValue(attribute.Id, out var values)
                        ? values
                        : new List<QuoteListAttributeValueDto>()))
                .ToList());

        var fileLookup = details.Files
            .GroupBy(file => file.ItemId)
            .ToDictionary(group => group.Key, group => group
                .Select(file => new QuoteListFileDto(
                    file.Id.ToString(),
                    ResolveFileLocation(file),
                    new QuoteListFileMetadataDto(file.PhotoType, file.Description ?? string.Empty, file.PhotoSubtype)))
                .ToList());

        return new QuoteLookups(
            categoryLookup,
            brandLookup,
            customerLookup,
            quoteLookup,
            attributeLookup,
            fileLookup);
    }

    private static Dictionary<Guid, List<QuoteListItemDetailDto>> BuildQuoteItems(
        QuoteDetails details,
        QuoteLookups lookups)
    {
        return details.Items
            .GroupBy(item => item.QuoteId)
            .ToDictionary(group => group.Key, group => group.Select(item =>
            {
                var attributes = lookups.AttributeLookup.TryGetValue(item.Id, out var itemAttributesList)
                    ? itemAttributesList
                    : new List<QuoteListAttributeDto>();
                var fileItems = lookups.FileLookup.TryGetValue(item.Id, out var itemFiles)
                    ? itemFiles
                    : new List<QuoteListFileDto>();
                var categoryName = lookups.CategoryLookup.TryGetValue(item.CategoryId, out var name) ? name : string.Empty;
                var brandName = lookups.BrandLookup.TryGetValue(item.BrandId, out var brand) ? brand : string.Empty;

                var itemCreatedAt = lookups.QuoteLookup[item.QuoteId].CreatedAt;
                var itemCreatedAtOffset = new DateTimeOffset(DateTime.SpecifyKind(itemCreatedAt, DateTimeKind.Utc));

                return new QuoteListItemDetailDto(
                    SubmissionId: item.QuoteId.ToString(),
                    Id: item.Id.ToString(),
                    CreatedAt: itemCreatedAtOffset,
                    LastUpdatedAt: null,
                    ExternalId: item.Id.ToString(),
                    Status: "Created",
                    Category: new QuoteLookupDto(item.CategoryId.ToString(), categoryName),
                    Brand: new QuoteLookupDto(item.BrandId.ToString(), brandName),
                    Model: item.Model,
                    Description: item.Description ?? string.Empty,
                    Attributes: attributes,
                    Files: fileItems,
                    RejectionReasons: null,
                    CancellationReasons: null,
                    Offers: Array.Empty<object>(),
                    Price: null,
                    RejectedAt: null,
                    CanceledAt: null,
                    TimedOutAt: null,
                    MoreInformationRequestedAt: null,
                    MoreInformationReceivedAt: null);
            }).ToList());
    }

    private static List<QuoteListItemDto> BuildQuoteDtos(
        IReadOnlyCollection<QuoteRow> quotes,
        QuoteLookups lookups,
        Dictionary<Guid, List<QuoteListItemDetailDto>> itemsByQuote)
    {
        return quotes.Select(quote =>
        {
            var createdAt = new DateTimeOffset(DateTime.SpecifyKind(quote.CreatedAt, DateTimeKind.Utc));
            var customer = lookups.CustomerLookup.TryGetValue(quote.Id, out var value)
                ? value
                : new CustomerRow(Guid.Empty, quote.Id, null, string.Empty, string.Empty, string.Empty);

            return new QuoteListItemDto(
                Id: quote.Id.ToString(),
                CreatedAt: createdAt,
                LastUpdatedAt: null,
                Status: "Active",
                ExternalId: quote.Id.ToString(),
                Reference: BuildReference(quote.Id),
                CountryOfOrigin: quote.CountryOfOriginIsoCode,
                CurrencyIsoCode: ResolveCurrency(quote.CountryOfOriginIsoCode),
                CustomerInformation: new QuoteCustomerInformationDto(
                    ExternalUserId: null,
                    ExternalUserNumericId: null,
                    FirstName: customer.FirstName,
                    LastName: customer.LastName,
                    Email: customer.Email,
                    TelephoneNumber: null,
                    ExternalSellerTier: customer.ExternalSellerTier,
                    IsVipCustomer: false),
                Seller: new QuoteSellerDto("239ff3d0-ab9a-0c8d-ad28-0a8e152a02f8", "Farfetch"),
                Items: itemsByQuote.TryGetValue(quote.Id, out var itemList) ? itemList : new List<QuoteListItemDetailDto>());
        }).ToList();
    }

    private sealed record QuoteDetails(
        IReadOnlyCollection<CustomerRow> Customers,
        IReadOnlyCollection<ItemRow> Items,
        IReadOnlyCollection<ItemAttributeRow> ItemAttributes,
        IReadOnlyCollection<ItemAttributeValueRow> AttributeValues,
        IReadOnlyCollection<ItemFileRow> Files,
        IReadOnlyCollection<LookupRow> Categories,
        IReadOnlyCollection<LookupRow> Brands);

    private sealed record QuoteLookups(
        IReadOnlyDictionary<Guid, string> CategoryLookup,
        IReadOnlyDictionary<Guid, string> BrandLookup,
        IReadOnlyDictionary<Guid, CustomerRow> CustomerLookup,
        IReadOnlyDictionary<Guid, QuoteRow> QuoteLookup,
        IReadOnlyDictionary<Guid, List<QuoteListAttributeDto>> AttributeLookup,
        IReadOnlyDictionary<Guid, List<QuoteListFileDto>> FileLookup);

    private sealed record QuoteRow(Guid Id, string CountryOfOriginIsoCode, DateTime CreatedAt);

    private sealed record CustomerRow(
        Guid Id,
        Guid QuoteId,
        string? ExternalSellerTier,
        string FirstName,
        string LastName,
        string Email);

    private sealed record ItemRow(
        Guid Id,
        Guid QuoteId,
        Guid CategoryId,
        Guid BrandId,
        string Model,
        string? Description);

    private sealed record ItemAttributeRow(
        Guid Id,
        Guid ItemId,
        Guid AttributeId,
        string AttributeName);

    private sealed record ItemAttributeValueRow(
        Guid ItemAttributeId,
        Guid ValueId,
        string Label);

    private static string ResolveFileLocation(ItemFileRow file)
    {
        if (!string.IsNullOrWhiteSpace(file.Location))
        {
            return NormalizeDriveLocation(file.Location) ?? file.Location;
        }

        var externalId = !string.IsNullOrWhiteSpace(file.ExternalId) ? file.ExternalId : file.UploadExternalId;
        if (!string.IsNullOrWhiteSpace(externalId))
        {
            return $"https://drive.google.com/thumbnail?id={externalId}&sz=w1000";
        }

        if (!string.IsNullOrWhiteSpace(file.UploadLocation))
        {
            return NormalizeDriveLocation(file.UploadLocation) ?? file.UploadLocation;
        }

        return string.Empty;
    }

    private static string? NormalizeDriveLocation(string location)
    {
        if (!location.Contains("drive.google.com", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        if (!TryExtractDriveId(location, out var id))
        {
            return null;
        }

        return $"https://drive.google.com/thumbnail?id={id}&sz=w1000";
    }

    private static bool TryExtractDriveId(string location, out string id)
    {
        id = string.Empty;
        try
        {
            var uri = new Uri(location);
            var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
            var idParam = query.Get("id");
            if (!string.IsNullOrWhiteSpace(idParam))
            {
                id = idParam;
                return true;
            }

            var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
            var fileIndex = Array.FindIndex(segments, segment => segment.Equals("d", StringComparison.OrdinalIgnoreCase));
            if (fileIndex >= 0 && fileIndex + 1 < segments.Length)
            {
                id = segments[fileIndex + 1];
                return true;
            }
        }
        catch
        {
            return false;
        }

        return false;
    }

    private sealed record ItemFileRow(
        Guid Id,
        Guid ItemId,
        string? ExternalId,
        string? Location,
        string? UploadExternalId,
        string? UploadLocation,
        string PhotoType,
        string PhotoSubtype,
        string? Description);

    private sealed record LookupRow(Guid Id, string Name);
}
