using Luxclusif.Backend.Domain.Exceptions;
using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class Quote
{
    private static readonly string[] RequiredPhotoSubtypes =
    [
        "Front",
        "Back",
        "Bottom",
        "Inside"
    ];

    public Quote(string id, string countryOfOriginIsoCode, Customer customer, IReadOnlyCollection<Item> items)
    {
        DomainValidation.Required(id, nameof(id));
        DomainValidation.Required(countryOfOriginIsoCode, nameof(countryOfOriginIsoCode));
        DomainValidation.ExactLength(countryOfOriginIsoCode, 2, nameof(countryOfOriginIsoCode));
        DomainValidation.Required(customer, nameof(customer));
        DomainValidation.Required(items, nameof(items));
        DomainValidation.NotEmpty(items, nameof(items));

        Id = id;
        CountryOfOriginIsoCode = countryOfOriginIsoCode.ToUpperInvariant();
        Customer = customer;
        Items = items;
        CreatedAt = DateTimeOffset.UtcNow;

        ValidateRequiredPhotos();
    }

    public string Id { get; }
    public string CountryOfOriginIsoCode { get; }
    public Customer Customer { get; }
    public IReadOnlyCollection<Item> Items { get; }
    public DateTimeOffset CreatedAt { get; }

    private void ValidateRequiredPhotos()
    {
        foreach (var item in Items)
        {
            var subtypes = item.Files
                .Select(file => file.Metadata.PhotoSubtype)
                .Where(subtype => !string.IsNullOrWhiteSpace(subtype))
                .Select(subtype => subtype.Trim())
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            foreach (var required in RequiredPhotoSubtypes)
            {
                if (!subtypes.Contains(required))
                {
                    throw new DomainException($"Item must include photo subtype '{required}'.");
                }
            }
        }
    }
}
