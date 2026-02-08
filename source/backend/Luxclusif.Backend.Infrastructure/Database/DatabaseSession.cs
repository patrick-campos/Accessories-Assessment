using System.Threading;
using Npgsql;

namespace Luxclusif.Backend.Infrastructure.Database;

public sealed class DatabaseSession
{
    private static readonly AsyncLocal<DatabaseSession?> CurrentSession = new();

    public DatabaseSession(NpgsqlConnection connection, NpgsqlTransaction transaction)
    {
        Connection = connection;
        Transaction = transaction;
    }

    public static DatabaseSession? Current
    {
        get => CurrentSession.Value;
        set => CurrentSession.Value = value;
    }

    public NpgsqlConnection Connection { get; }
    public NpgsqlTransaction Transaction { get; }
}
