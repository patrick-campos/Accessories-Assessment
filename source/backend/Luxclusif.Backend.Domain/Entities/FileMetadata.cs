using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class FileMetadata
{
    public FileMetadata(string photoType, string photoSubtype, string description)
    {
        DomainValidation.Required(photoType, nameof(photoType));
        DomainValidation.Required(photoSubtype, nameof(photoSubtype));

        PhotoType = photoType.Trim();
        PhotoSubtype = photoSubtype.Trim();
        Description = description?.Trim() ?? string.Empty;
    }

    public string PhotoType { get; }
    public string PhotoSubtype { get; }
    public string Description { get; }
}
