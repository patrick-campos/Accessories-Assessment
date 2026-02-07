using Luxclusif.Backend.Domain.Enums;
using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class CategoryAttribute
{
    public CategoryAttribute(
        string id,
        string name,
        string key,
        int displayOrder,
        AttributeType type,
        IReadOnlyCollection<AttributeOption> options,
        bool isRequired,
        string businessModel)
    {
        DomainValidation.Required(id, nameof(id));
        DomainValidation.Required(name, nameof(name));
        DomainValidation.Required(key, nameof(key));
        DomainValidation.Required(businessModel, nameof(businessModel));
        DomainValidation.Required(options, nameof(options));
        DomainValidation.NotEmpty(options, nameof(options));

        Id = id;
        Name = name.Trim();
        Key = key.Trim();
        DisplayOrder = displayOrder;
        Type = type;
        Options = options;
        IsRequired = isRequired;
        BusinessModel = businessModel.Trim();
    }

    public string Id { get; }
    public string Name { get; }
    public string Key { get; }
    public int DisplayOrder { get; }
    public AttributeType Type { get; }
    public IReadOnlyCollection<AttributeOption> Options { get; }
    public bool IsRequired { get; }
    public string BusinessModel { get; }
}
