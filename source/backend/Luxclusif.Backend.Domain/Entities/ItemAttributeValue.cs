using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class ItemAttributeValue
{
    public ItemAttributeValue(string id, string label)
    {
        DomainValidation.Required(id, nameof(id));
        DomainValidation.Required(label, nameof(label));

        Id = id;
        Label = label.Trim();
    }

    public string Id { get; }
    public string Label { get; }
}
