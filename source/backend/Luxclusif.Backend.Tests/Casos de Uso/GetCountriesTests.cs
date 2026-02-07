using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.UseCases.Countries;
using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Tests.Casos_de_Uso;

public sealed class GetCountriesTests
{
    [Fact]
    public async Task ValidateGetCountriesReturnsItemsDeveTerSucesso()
    {
        var repository = new InMemoryCountryRepository(new List<Country>
        {
            new("BR", "Brazil"),
            new("US", "United States")
        });

        var useCase = new GetCountries(repository);
        var response = await useCase.ExecuteAsync(CancellationToken.None);

        Assert.Equal(2, response.Items.Count);
    }

    private sealed class InMemoryCountryRepository : ICountryRepository
    {
        private readonly IReadOnlyCollection<Country> _items;

        public InMemoryCountryRepository(IReadOnlyCollection<Country> items)
        {
            _items = items;
        }

        public Task<IReadOnlyCollection<Country>> GetAllAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(_items);
        }

        public Task<bool> ExistsAsync(string isoCode, CancellationToken cancellationToken)
        {
            return Task.FromResult(_items.Any(country => country.IsoCode == isoCode));
        }
    }
}
