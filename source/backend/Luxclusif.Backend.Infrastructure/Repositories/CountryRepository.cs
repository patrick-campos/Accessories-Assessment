using Dapper;
using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Domain.Entities;
using Luxclusif.Backend.Infrastructure.Commands;
using Luxclusif.Backend.Infrastructure.Database;

namespace Luxclusif.Backend.Infrastructure.Repositories;

public sealed class CountryRepository : RepositoryBase, ICountryRepository
{
    private readonly NpgsqlConnectionFactory _connectionFactory;

    public CountryRepository(NpgsqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IReadOnlyCollection<Country>> GetAllAsync(CancellationToken cancellationToken)
    {
        var (connection, transaction, shouldDispose) = await GetSessionAsync(_connectionFactory, cancellationToken);
        try
        {
            var rows = await connection.QueryAsync<CountryRow>(CountryCommands.SelectAll, transaction: transaction);
            return rows.Select(row => new Country(row.IsoCode, row.Name)).ToList();
        }
        finally
        {
            if (shouldDispose)
            {
                await connection.DisposeAsync();
            }
        }
    }

    public async Task<bool> ExistsAsync(string isoCode, CancellationToken cancellationToken)
    {
        var (connection, transaction, shouldDispose) = await GetSessionAsync(_connectionFactory, cancellationToken);
        try
        {
            var count = await connection.ExecuteScalarAsync<int>(
                CountryCommands.ExistsByIsoCode,
                new { IsoCode = isoCode },
                transaction);
            return count > 0;
        }
        finally
        {
            if (shouldDispose)
            {
                await connection.DisposeAsync();
            }
        }
    }

    private sealed record CountryRow(string IsoCode, string Name);
}
