using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class FileUpload
{
    public FileUpload(string id, string provider, string externalId, string location, FileMetadata metadata)
    {
        DomainValidation.Required(id, nameof(id));
        DomainValidation.Required(provider, nameof(provider));
        DomainValidation.Required(externalId, nameof(externalId));
        DomainValidation.Required(metadata, nameof(metadata));

        Id = id;
        Provider = provider.Trim();
        ExternalId = externalId.Trim();
        Location = location?.Trim() ?? string.Empty;
        Metadata = metadata;
    }

    public string Id { get; }
    public string Provider { get; }
    public string ExternalId { get; }
    public string Location { get; }
    public FileMetadata Metadata { get; }
}
