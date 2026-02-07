using Luxclusif.Backend.Domain.ValueObjects;

namespace Luxclusif.Backend.Domain.Entities;

public sealed class Item
{
    public Item(
        string categoryId,
        string brandId,
        string model,
        string description,
        IReadOnlyCollection<ItemAttribute> attributes,
        IReadOnlyCollection<ItemFile> files)
    {
        DomainValidation.Required(categoryId, nameof(categoryId));
        DomainValidation.Required(brandId, nameof(brandId));
        DomainValidation.Required(model, nameof(model));
        DomainValidation.Required(files, nameof(files));
        DomainValidation.NotEmpty(files, nameof(files));

        CategoryId = categoryId;
        BrandId = brandId;
        Model = model.Trim();
        Description = description?.Trim() ?? string.Empty;
        Attributes = attributes ?? Array.Empty<ItemAttribute>();
        Files = files;
    }

    public string CategoryId { get; }
    public string BrandId { get; }
    public string Model { get; }
    public string Description { get; }
    public IReadOnlyCollection<ItemAttribute> Attributes { get; }
    public IReadOnlyCollection<ItemFile> Files { get; }
}
