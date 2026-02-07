using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Dtos;

namespace Luxclusif.Backend.Application.UseCases.Countries;

public sealed class GetCountries
{
    private readonly ICountryRepository _countryRepository;

    public GetCountries(ICountryRepository countryRepository)
    {
        _countryRepository = countryRepository;
    }

    public async Task<ListResponse<CountryDto>> ExecuteAsync(CancellationToken cancellationToken)
    {
        var countries = await _countryRepository.GetAllAsync(cancellationToken);
        var items = countries
            .Select(country => new CountryDto(country.IsoCode, country.Name))
            .ToList();

        return new ListResponse<CountryDto>(items);
    }
}
