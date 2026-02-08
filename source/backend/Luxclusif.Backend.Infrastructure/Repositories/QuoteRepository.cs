using Dapper;
using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Domain.Entities;
using Luxclusif.Backend.Infrastructure.Commands;
using Luxclusif.Backend.Infrastructure.Database;

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
            var totalItems = await connection.ExecuteScalarAsync<int>(
                "SELECT COUNT(*) FROM quotes",
                transaction: transaction);

            var offset = (page - 1) * pageSize;
            var quotes = (await connection.QueryAsync<QuoteRow>(
                """
                SELECT id AS Id,
                       country_of_origin_iso_code AS CountryOfOriginIsoCode,
                       created_at AS CreatedAt
                FROM quotes
                ORDER BY created_at DESC
                OFFSET @Offset
                LIMIT @Limit
                """,
                new { Offset = offset, Limit = pageSize },
                transaction)).ToList();

            if (quotes.Count == 0)
            {
                return new PagedQuoteList(totalItems, Array.Empty<QuoteListItemDto>());
            }

            var quoteIds = quotes.Select(quote => quote.Id).ToArray();

            var multi = await connection.QueryMultipleAsync(
                """
                SELECT id AS Id,
                       quote_id AS QuoteId,
                       external_seller_tier AS ExternalSellerTier,
                       first_name AS FirstName,
                       last_name AS LastName,
                       email AS Email
                FROM customers
                WHERE quote_id = ANY(@QuoteIds);

                SELECT id AS Id,
                       quote_id AS QuoteId,
                       category_id AS CategoryId,
                       brand_id AS BrandId,
                       model AS Model,
                       description AS Description
                FROM items
                WHERE quote_id = ANY(@QuoteIds);

                SELECT ia.id AS Id,
                       ia.item_id AS ItemId,
                       ia.attribute_id AS AttributeId,
                       ca.name AS AttributeName
                FROM item_attributes ia
                JOIN items i ON i.id = ia.item_id
                JOIN category_attributes ca ON ca.id = ia.attribute_id
                WHERE i.quote_id = ANY(@QuoteIds);

                SELECT iav.item_attribute_id AS ItemAttributeId,
                       iav.value_id AS ValueId,
                       iav.label AS Label
                FROM item_attribute_values iav
                JOIN item_attributes ia ON ia.id = iav.item_attribute_id
                JOIN items i ON i.id = ia.item_id
                WHERE i.quote_id = ANY(@QuoteIds);

                SELECT f.id AS Id,
                       f.item_id AS ItemId,
                       f.location AS Location,
                       f.photo_type AS PhotoType,
                       f.photo_subtype AS PhotoSubtype,
                       f.description AS Description
                FROM item_files f
                JOIN items i ON i.id = f.item_id
                WHERE i.quote_id = ANY(@QuoteIds);

                SELECT c.id AS Id, c.name AS Name
                FROM categories c
                JOIN items i ON i.category_id = c.id
                WHERE i.quote_id = ANY(@QuoteIds);

                SELECT b.id AS Id, b.name AS Name
                FROM brands b
                JOIN items i ON i.brand_id = b.id
                WHERE i.quote_id = ANY(@QuoteIds);
                """,
                new { QuoteIds = quoteIds },
                transaction);

            var customers = (await multi.ReadAsync<CustomerRow>()).ToList();
            var items = (await multi.ReadAsync<ItemRow>()).ToList();
            var itemAttributes = (await multi.ReadAsync<ItemAttributeRow>()).ToList();
            var attributeValues = (await multi.ReadAsync<ItemAttributeValueRow>()).ToList();
            var files = (await multi.ReadAsync<ItemFileRow>()).ToList();
            var categories = (await multi.ReadAsync<LookupRow>()).ToList();
            var brands = (await multi.ReadAsync<LookupRow>()).ToList();

            var categoryLookup = categories.ToDictionary(entry => entry.Id, entry => entry.Name);
            var brandLookup = brands.ToDictionary(entry => entry.Id, entry => entry.Name);
            var customerLookup = customers.ToDictionary(entry => entry.QuoteId);
            var quoteLookup = quotes.ToDictionary(quote => quote.Id);

            var attributeValueLookup = attributeValues
                .GroupBy(value => value.ItemAttributeId)
                .ToDictionary(group => group.Key, group => group
                    .Select(value => new QuoteListAttributeValueDto(value.ValueId.ToString(), value.Label))
                    .ToList());

            var attributeLookup = itemAttributes
                .GroupBy(attribute => attribute.ItemId)
                .ToDictionary(group => group.Key, group => group
                    .Select(attribute => new QuoteListAttributeDto(
                        attribute.AttributeId.ToString(),
                        attribute.AttributeName,
                        attributeValueLookup.TryGetValue(attribute.Id, out var values)
                            ? values
                            : new List<QuoteListAttributeValueDto>()))
                    .ToList());

            var fileLookup = files
                .GroupBy(file => file.ItemId)
                .ToDictionary(group => group.Key, group => group
                    .Select(file => new QuoteListFileDto(
                        file.Id.ToString(),
                        file.Location,
                        new QuoteListFileMetadataDto(file.PhotoType, file.Description ?? string.Empty, file.PhotoSubtype)))
                    .ToList());

            var itemsByQuote = items
                .GroupBy(item => item.QuoteId)
                .ToDictionary(group => group.Key, group => group.Select(item =>
                {
                    var attributes = attributeLookup.TryGetValue(item.Id, out var itemAttributesList)
                        ? itemAttributesList
                        : new List<QuoteListAttributeDto>();
                    var fileItems = fileLookup.TryGetValue(item.Id, out var itemFiles)
                        ? itemFiles
                        : new List<QuoteListFileDto>();
                    var categoryName = categoryLookup.TryGetValue(item.CategoryId, out var name) ? name : string.Empty;
                    var brandName = brandLookup.TryGetValue(item.BrandId, out var brand) ? brand : string.Empty;

                    var itemCreatedAt = quoteLookup[item.QuoteId].CreatedAt;
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

            var resultItems = quotes.Select(quote =>
            {
                var createdAt = new DateTimeOffset(DateTime.SpecifyKind(quote.CreatedAt, DateTimeKind.Utc));
                var customer = customerLookup.TryGetValue(quote.Id, out var value)
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

    private sealed record ItemFileRow(
        Guid Id,
        Guid ItemId,
        string Location,
        string PhotoType,
        string PhotoSubtype,
        string? Description);

    private sealed record LookupRow(Guid Id, string Name);
}
