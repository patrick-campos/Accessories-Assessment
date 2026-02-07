using Dapper;
using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Domain.Entities;
using Luxclusif.Backend.Infrastructure.Commands;
using Luxclusif.Backend.Infrastructure.Database;

namespace Luxclusif.Backend.Infrastructure.Repositories;

public sealed class BrandRepository : RepositoryBase, IBrandRepository
{
    private readonly NpgsqlConnectionFactory _connectionFactory;

    public BrandRepository(NpgsqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IReadOnlyCollection<Brand>> GetByFiltersAsync(string categoryId, string countryIsoCode, bool hasAvailableBuyer, CancellationToken cancellationToken)
    {
        var (connection, transaction, shouldDispose) = await GetSessionAsync(_connectionFactory, cancellationToken);
        try
        {
            var rows = await connection.QueryAsync<BrandRow>(
                BrandCommands.SelectByFilters,
                new
                {
                    CategoryId = Guid.Parse(categoryId),
                    CountryIsoCode = countryIsoCode,
                    HasAvailableBuyer = hasAvailableBuyer
                },
                transaction);
            return rows.Select(row => new Brand(row.Id, row.Name)).ToList();
        }
        finally
        {
            if (shouldDispose)
            {
                await connection.DisposeAsync();
            }
        }
    }

    private sealed record BrandRow(string Id, string Name);
}
