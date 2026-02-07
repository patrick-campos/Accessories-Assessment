using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Luxclusif.Backend.Infrastructure.Database;

public sealed class NpgsqlConnectionFactory
{
    private readonly string _connectionString;

    public NpgsqlConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("Postgres")
            ?? throw new InvalidOperationException("Connection string 'Postgres' not configured.");
    }

    public NpgsqlConnection Create()
    {
        return new NpgsqlConnection(_connectionString);
    }
}
