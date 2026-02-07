using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.UseCases.Brands;
using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Tests.Casos_de_Uso;

public sealed class GetBrandsTests
{
    [Fact]
    public async Task ValidateGetBrandsReturnsEntriesDeveTerSucesso()
    {
        var repository = new InMemoryBrandRepository(new List<Brand>
        {
            new("1", "Brand A"),
            new("2", "Brand B")
        });

        var useCase = new GetBrands(repository);
        var response = await useCase.ExecuteAsync("cat", "BR", true, CancellationToken.None);

        Assert.Equal(2, response.Entries.Count);
    }

    private sealed class InMemoryBrandRepository : IBrandRepository
    {
        private readonly IReadOnlyCollection<Brand> _items;

        public InMemoryBrandRepository(IReadOnlyCollection<Brand> items)
        {
            _items = items;
        }

        public Task<IReadOnlyCollection<Brand>> GetByFiltersAsync(string categoryId, string countryIsoCode, bool hasAvailableBuyer, CancellationToken cancellationToken)
        {
            return Task.FromResult(_items);
        }
    }
}
