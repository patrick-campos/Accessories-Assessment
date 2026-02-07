using Luxclusif.Backend.Domain.Enums;
using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class AttributeOption
{
    public AttributeOption(string id, string name, string key, int displayOrder, string outputLabel)
    {
        DomainValidation.Required(id, nameof(id));
        DomainValidation.Required(name, nameof(name));
        DomainValidation.Required(key, nameof(key));
        DomainValidation.Required(outputLabel, nameof(outputLabel));

        Id = id;
        Name = name.Trim();
        Key = key.Trim();
        DisplayOrder = displayOrder;
        OutputLabel = outputLabel.Trim();
    }

    public string Id { get; }
    public string Name { get; }
    public string Key { get; }
    public int DisplayOrder { get; }
    public string OutputLabel { get; }
}
