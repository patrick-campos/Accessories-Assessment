using Dapper;
using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Domain.Entities;
using Luxclusif.Backend.Infrastructure.Commands;
using Luxclusif.Backend.Infrastructure.Database;

namespace Luxclusif.Backend.Infrastructure.Repositories;

public sealed class CategoryRepository : RepositoryBase, ICategoryRepository
{
    private readonly NpgsqlConnectionFactory _connectionFactory;

    public CategoryRepository(NpgsqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IReadOnlyCollection<Category>> GetByFiltersAsync(string countryIsoCode, bool hasAvailableBuyer, CancellationToken cancellationToken)
    {
        var (connection, transaction, shouldDispose) = await GetSessionAsync(_connectionFactory, cancellationToken);
        try
        {
            var rows = await connection.QueryAsync<CategoryRow>(
                CategoryCommands.SelectByFilters,
                new { CountryIsoCode = countryIsoCode, HasAvailableBuyer = hasAvailableBuyer },
                transaction);
            return rows.Select(row => new Category(row.Id, row.Name)).ToList();
        }
        finally
        {
            if (shouldDispose)
            {
                await connection.DisposeAsync();
            }
        }
    }

    private sealed record CategoryRow(string Id, string Name);
}
