using Dapper;
using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Domain.Entities;
using Luxclusif.Backend.Infrastructure.Commands;
using Luxclusif.Backend.Infrastructure.Database;

namespace Luxclusif.Backend.Infrastructure.Repositories;

public sealed class FileUploadRepository : RepositoryBase, IFileUploadRepository
{
    private readonly NpgsqlConnectionFactory _connectionFactory;

    public FileUploadRepository(NpgsqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task SaveAsync(FileUpload fileUpload, CancellationToken cancellationToken)
    {
        var (connection, transaction, shouldDispose) = await GetSessionAsync(_connectionFactory, cancellationToken);
        try
        {
            await connection.ExecuteAsync(
                FileUploadCommands.Insert,
                new
                {
                    fileUpload.Id,
                    fileUpload.Provider,
                    fileUpload.ExternalId,
                    fileUpload.Location,
                    PhotoType = fileUpload.Metadata.PhotoType,
                    PhotoSubtype = fileUpload.Metadata.PhotoSubtype,
                    Description = fileUpload.Metadata.Description
                },
                transaction);
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
