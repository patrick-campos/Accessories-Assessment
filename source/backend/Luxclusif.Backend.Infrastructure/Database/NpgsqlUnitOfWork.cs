using Luxclusif.Backend.Application.Abstractions.Repositories;

namespace Luxclusif.Backend.Infrastructure.Database;

public sealed class NpgsqlUnitOfWork : IUnitOfWork
{
    private readonly NpgsqlConnectionFactory _connectionFactory;

    public NpgsqlUnitOfWork(NpgsqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task ExecuteAsync(Func<CancellationToken, Task> action, CancellationToken cancellationToken)
    {
        await using var connection = _connectionFactory.Create();
        await connection.OpenAsync(cancellationToken);
        await using var transaction = await connection.BeginTransactionAsync(cancellationToken);

        var session = new DatabaseSession(connection, transaction);
        DatabaseSession.Current = session;

        try
        {
            await action(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
        finally
        {
            DatabaseSession.Current = null;
        }
    }
}
