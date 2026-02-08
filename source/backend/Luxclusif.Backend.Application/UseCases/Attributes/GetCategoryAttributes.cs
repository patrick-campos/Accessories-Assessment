using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Dtos;

namespace Luxclusif.Backend.Application.UseCases.Attributes;

public sealed class GetCategoryAttributes
{
    private readonly IAttributeRepository _attributeRepository;

    public GetCategoryAttributes(IAttributeRepository attributeRepository)
    {
        _attributeRepository = attributeRepository;
    }

    public async Task<ListResponse<AttributeDto>> ExecuteAsync(string categoryId, CancellationToken cancellationToken)
    {
        var attributes = await _attributeRepository.GetByCategoryIdAsync(categoryId, cancellationToken);
        var items = attributes.Select(attribute => new AttributeDto(
            attribute.Id,
            attribute.Name,
            attribute.Key,
            attribute.DisplayOrder,
            attribute.Type.ToString(),
            attribute.Options.Select(option => new AttributeOptionDto(
                option.Id,
                option.Name,
                option.Key,
                option.DisplayOrder,
                option.OutputLabel)).ToList(),
            attribute.IsRequired,
            attribute.BusinessModel)).ToList();

        return new ListResponse<AttributeDto>(items);
    }
}
