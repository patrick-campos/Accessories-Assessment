using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Dtos;

namespace Luxclusif.Backend.Application.UseCases.Brands;

public sealed class GetBrands
{
    private readonly IBrandRepository _brandRepository;

    public GetBrands(IBrandRepository brandRepository)
    {
        _brandRepository = brandRepository;
    }

    public async Task<EntriesResponse<BrandDto>> ExecuteAsync(string categoryId, string countryIsoCode, bool hasAvailableBuyer, CancellationToken cancellationToken)
    {
        var brands = await _brandRepository.GetByFiltersAsync(categoryId, countryIsoCode, hasAvailableBuyer, cancellationToken);
        var entries = brands
            .Select(brand => new BrandDto(brand.Id, brand.Name))
            .ToList();

        return new EntriesResponse<BrandDto>(entries);
    }
}
