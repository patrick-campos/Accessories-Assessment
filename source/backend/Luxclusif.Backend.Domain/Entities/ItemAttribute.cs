using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class ItemAttribute
{
    public ItemAttribute(string attributeId, IReadOnlyCollection<ItemAttributeValue> values)
    {
        DomainValidation.Required(attributeId, nameof(attributeId));
        DomainValidation.Required(values, nameof(values));
        DomainValidation.NotEmpty(values, nameof(values));

        AttributeId = attributeId;
        Values = values;
    }

    public string AttributeId { get; }
    public IReadOnlyCollection<ItemAttributeValue> Values { get; }
}
