using Luxclusif.Backend.Domain.Entities;
using Luxclusif.Backend.Domain.Exceptions;

namespace Luxclusif.Backend.Tests.Dominios;

public sealed class QuoteTests
{
    [Fact]
    public void ValidateQuoteWithoutRequiredPhotosDeveFalhar()
    {
        var customer = new Customer("Tier", "John", "Doe", "john.doe@example.com");
        var files = new List<ItemFile>
        {
            new("Photos", "FileAPI", "1", "", new FileMetadata("None", "Front", ""))
        };
        var items = new List<Item>
        {
            new("category", "brand", "Model", "", new List<ItemAttribute>(), files)
        };

        Action action = () => _ = new Quote(Guid.NewGuid().ToString(), "GB", customer, items);

        Assert.Throws<DomainException>(action);
    }

    [Fact]
    public void ValidateQuoteWithValidDataDeveTerSucesso()
    {
        var customer = new Customer("Tier", "John", "Doe", "john.doe@example.com");
        var files = new List<ItemFile>
        {
            new("Photos", "FileAPI", "1", "", new FileMetadata("None", "Front", "")),
            new("Photos", "FileAPI", "2", "", new FileMetadata("None", "Back", "")),
            new("Photos", "FileAPI", "3", "", new FileMetadata("None", "Bottom", "")),
            new("Photos", "FileAPI", "4", "", new FileMetadata("None", "Inside", ""))
        };
        var items = new List<Item>
        {
            new("category", "brand", "Model", "", new List<ItemAttribute>(), files)
        };

        var quote = new Quote(Guid.NewGuid().ToString(), "GB", customer, items);

        Assert.Equal("GB", quote.CountryOfOriginIsoCode);
        Assert.Single(quote.Items);
    }
}
