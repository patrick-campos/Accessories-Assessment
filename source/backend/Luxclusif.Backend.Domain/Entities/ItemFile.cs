using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class ItemFile
{
    public ItemFile(string type, string provider, string externalId, string location, FileMetadata metadata)
    {
        DomainValidation.Required(type, nameof(type));
        DomainValidation.Required(provider, nameof(provider));
        DomainValidation.Required(externalId, nameof(externalId));
        DomainValidation.Required(metadata, nameof(metadata));

        Type = type.Trim();
        Provider = provider.Trim();
        ExternalId = externalId.Trim();
        Location = location?.Trim() ?? string.Empty;
        Metadata = metadata;
    }

    public string Type { get; }
    public string Provider { get; }
    public string ExternalId { get; }
    public string Location { get; }
    public FileMetadata Metadata { get; }
}
