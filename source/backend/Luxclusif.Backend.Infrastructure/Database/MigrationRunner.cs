using Dapper;
using Npgsql;

namespace Luxclusif.Backend.Infrastructure.Database;

public sealed class MigrationRunner
{
    private readonly NpgsqlConnectionFactory _connectionFactory;

    public MigrationRunner(NpgsqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task RunAsync(CancellationToken cancellationToken)
    {
        await using var connection = _connectionFactory.Create();
        await connection.OpenAsync(cancellationToken);

        await connection.ExecuteAsync(
            "CREATE TABLE IF NOT EXISTS schema_migrations (script_name text primary key, applied_at timestamptz not null);");

        var migrations = LoadMigrationScripts();

        foreach (var migration in migrations)
        {
            var exists = await connection.ExecuteScalarAsync<int>(
                "SELECT COUNT(1) FROM schema_migrations WHERE script_name = @Name",
                new { Name = migration.Name });

            if (exists > 0)
            {
                continue;
            }

            await using var transaction = await connection.BeginTransactionAsync(cancellationToken);
            await connection.ExecuteAsync(migration.Sql, transaction: transaction);
            await connection.ExecuteAsync(
                "INSERT INTO schema_migrations (script_name, applied_at) VALUES (@Name, @AppliedAt)",
                new { migration.Name, AppliedAt = DateTimeOffset.UtcNow },
                transaction);

            await transaction.CommitAsync(cancellationToken);
        }
    }

    private static IReadOnlyCollection<(string Name, string Sql)> LoadMigrationScripts()
    {
        var migrationsPath = Path.Combine(AppContext.BaseDirectory, "Migrations");
        if (!Directory.Exists(migrationsPath))
        {
            return Array.Empty<(string Name, string Sql)>();
        }

        var files = Directory.GetFiles(migrationsPath, "*.sql")
            .OrderBy(path => path)
            .ToArray();

        return files.Select(path => (Path.GetFileName(path), File.ReadAllText(path))).ToList();
    }
}
