using Luxclusif.Backend.Domain.Entities;
using Luxclusif.Backend.Domain.Exceptions;

namespace Luxclusif.Backend.Tests.Dominios;

public sealed class CountryTests
{
    [Fact]
    public void ValidateCountryWithEmptyIsoCodeDeveFalhar()
    {
        Action action = () => _ = new Country("", "Brazil");

        Assert.Throws<DomainException>(action);
    }

    [Fact]
    public void ValidateCountryWithInvalidIsoCodeLengthDeveFalhar()
    {
        Action action = () => _ = new Country("BRA", "Brazil");

        Assert.Throws<DomainException>(action);
    }

    [Fact]
    public void ValidateCountryWithValidDataDeveTerSucesso()
    {
        var country = new Country("BR", "Brazil");

        Assert.Equal("BR", country.IsoCode);
        Assert.Equal("Brazil", country.Name);
    }
}
