using Dapper;
using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Domain.Entities;
using Luxclusif.Backend.Domain.Enums;
using Luxclusif.Backend.Infrastructure.Commands;
using Luxclusif.Backend.Infrastructure.Database;

namespace Luxclusif.Backend.Infrastructure.Repositories;

public sealed class AttributeRepository : RepositoryBase, IAttributeRepository
{
    private readonly NpgsqlConnectionFactory _connectionFactory;

    public AttributeRepository(NpgsqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IReadOnlyCollection<CategoryAttribute>> GetByCategoryIdAsync(string categoryId, CancellationToken cancellationToken)
    {
        var (connection, transaction, shouldDispose) = await GetSessionAsync(_connectionFactory, cancellationToken);
        try
        {
            var attributeRows = (await connection.QueryAsync<AttributeRow>(
                AttributeCommands.SelectByCategory,
                new { CategoryId = Guid.Parse(categoryId) },
                transaction)).ToList();

            if (attributeRows.Count == 0)
            {
                return Array.Empty<CategoryAttribute>();
            }

            var attributeIds = attributeRows.Select(row => row.Id).ToArray();

            var optionRows = (await connection.QueryAsync<AttributeOptionRow>(
                AttributeCommands.SelectOptionsByAttributeIds,
                new { AttributeIds = attributeIds },
                transaction)).ToList();

            var optionsLookup = optionRows
                .GroupBy(option => option.AttributeId)
                .ToDictionary(group => group.Key, group => group
                    .Select(option => new AttributeOption(
                        option.Id.ToString(),
                        option.Name,
                        option.Key,
                        option.DisplayOrder,
                        option.OutputLabel))
                    .ToList());

            return attributeRows.Select(row => new CategoryAttribute(
                row.Id.ToString(),
                row.Name,
                row.Key,
                row.DisplayOrder,
                Enum.TryParse<AttributeType>(row.Type, true, out var type) ? type : AttributeType.OneOf,
                optionsLookup.TryGetValue(row.Id, out var options) ? options : new List<AttributeOption>(),
                row.IsRequired,
                row.BusinessModel)).ToList();
        }
        finally
        {
            if (shouldDispose)
            {
                await connection.DisposeAsync();
            }
        }
    }

    private sealed record AttributeRow(
        Guid Id,
        string Name,
        string Key,
        int DisplayOrder,
        string Type,
        bool IsRequired,
        string BusinessModel);

    private sealed record AttributeOptionRow(
        Guid Id,
        Guid AttributeId,
        string Name,
        string Key,
        int DisplayOrder,
        string OutputLabel);
}
