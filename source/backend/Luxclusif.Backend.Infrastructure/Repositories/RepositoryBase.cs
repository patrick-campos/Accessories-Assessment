using Luxclusif.Backend.Infrastructure.Database;
using Npgsql;

namespace Luxclusif.Backend.Infrastructure.Repositories;

public abstract class RepositoryBase
{
    protected async Task<(NpgsqlConnection Connection, NpgsqlTransaction? Transaction, bool ShouldDispose)> GetSessionAsync(
        NpgsqlConnectionFactory connectionFactory,
        CancellationToken cancellationToken)
    {
        if (DatabaseSession.Current is { } session)
        {
            return (session.Connection, session.Transaction, false);
        }

        var connection = connectionFactory.Create();
        await connection.OpenAsync(cancellationToken);
        return (connection, null, true);
    }
}
