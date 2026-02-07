using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class Brand
{
    public Brand(string id, string name)
    {
        DomainValidation.Required(id, nameof(id));
        DomainValidation.Required(name, nameof(name));

        Id = id;
        Name = name.Trim();
    }

    public string Id { get; }
    public string Name { get; }
}
