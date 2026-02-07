using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.UseCases.Categories;
using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Tests.Casos_de_Uso;

public sealed class GetCategoriesTests
{
    [Fact]
    public async Task ValidateGetCategoriesReturnsItemsDeveTerSucesso()
    {
        var repository = new InMemoryCategoryRepository(new List<Category>
        {
            new("1", "Bags"),
            new("2", "Shoes")
        });

        var useCase = new GetCategories(repository);
        var response = await useCase.ExecuteAsync("BR", true, CancellationToken.None);

        Assert.Equal(2, response.Items.Count);
    }

    private sealed class InMemoryCategoryRepository : ICategoryRepository
    {
        private readonly IReadOnlyCollection<Category> _items;

        public InMemoryCategoryRepository(IReadOnlyCollection<Category> items)
        {
            _items = items;
        }

        public Task<IReadOnlyCollection<Category>> GetByFiltersAsync(string countryIsoCode, bool hasAvailableBuyer, CancellationToken cancellationToken)
        {
            return Task.FromResult(_items);
        }
    }
}
