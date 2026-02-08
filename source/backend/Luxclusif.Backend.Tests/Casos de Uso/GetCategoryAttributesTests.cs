using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.UseCases.Attributes;
using Luxclusif.Backend.Domain.Entities;
using Luxclusif.Backend.Domain.Enums;

namespace Luxclusif.Backend.Tests.Casos_de_Uso;

public sealed class GetCategoryAttributesTests
{
    [Fact]
    public async Task ValidateGetCategoryAttributesReturnsItemsDeveTerSucesso()
    {
        var repository = new InMemoryAttributeRepository(new List<CategoryAttribute>
        {
            new(
                "1",
                "Size",
                "quote-creation:item-details.attributes.size.title",
                1,
                AttributeType.OneOf,
                new List<AttributeOption> { new("opt", "S", "key", 1, "S") },
                false,
                "Buyback")
        });

        var useCase = new GetCategoryAttributes(repository);
        var response = await useCase.ExecuteAsync("category", CancellationToken.None);

        Assert.Single(response.Items);
    }

    private sealed class InMemoryAttributeRepository : IAttributeRepository
    {
        private readonly IReadOnlyCollection<CategoryAttribute> _items;

        public InMemoryAttributeRepository(IReadOnlyCollection<CategoryAttribute> items)
        {
            _items = items;
        }

        public Task<IReadOnlyCollection<CategoryAttribute>> GetByCategoryIdAsync(string categoryId, CancellationToken cancellationToken)
        {
            return Task.FromResult(_items);
        }
    }
}
