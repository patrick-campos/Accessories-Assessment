using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class Country
{
    public Country(string isoCode, string name)
    {
        DomainValidation.Required(isoCode, nameof(isoCode));
        DomainValidation.ExactLength(isoCode, 2, nameof(isoCode));
        DomainValidation.Required(name, nameof(name));

        IsoCode = isoCode.ToUpperInvariant();
        Name = name.Trim();
    }

    public string IsoCode { get; }
    public string Name { get; }
}
