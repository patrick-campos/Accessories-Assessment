using Dapper;
using Luxclusif.Backend.Application.Abstractions.Repositories;
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
}
