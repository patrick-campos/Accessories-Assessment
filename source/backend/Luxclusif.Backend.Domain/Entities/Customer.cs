using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class Customer
{
    public Customer(string? externalSellerTier, string firstName, string lastName, string email)
    {
        DomainValidation.Required(firstName, nameof(firstName));
        DomainValidation.Required(lastName, nameof(lastName));
        DomainValidation.Required(email, nameof(email));
        DomainValidation.ValidEmail(email, nameof(email));

        ExternalSellerTier = externalSellerTier?.Trim();
        FirstName = firstName.Trim();
        LastName = lastName.Trim();
        Email = email.Trim();
    }

    public string? ExternalSellerTier { get; }
    public string FirstName { get; }
    public string LastName { get; }
    public string Email { get; }
}
