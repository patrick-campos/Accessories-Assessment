using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Dtos;

namespace Luxclusif.Backend.Application.UseCases.Categories;

public sealed class GetCategories
{
    private readonly ICategoryRepository _categoryRepository;

    public GetCategories(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<ListResponse<CategoryDto>> ExecuteAsync(string countryIsoCode, bool hasAvailableBuyer, CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetByFiltersAsync(countryIsoCode, hasAvailableBuyer, cancellationToken);
        var items = categories
            .Select(category => new CategoryDto(category.Id, category.Name))
            .ToList();

        return new ListResponse<CategoryDto>(items);
    }
}
