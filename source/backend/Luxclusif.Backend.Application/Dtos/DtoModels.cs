namespace Luxclusif.Backend.Application.Dtos;

public sealed record CountryDto(string IsoCode, string Name);

public sealed record CategoryDto(string Id, string Name);

public sealed record BrandDto(string Id, string Name);

public sealed record AttributeOptionDto(
    string Id,
    string Name,
    string Key,
    int DisplayOrder,
    string OutputLabel);

public sealed record AttributeDto(
    string Id,
    string Name,
    string Key,
    int DisplayOrder,
    string Type,
    IReadOnlyCollection<AttributeOptionDto> Options,
    bool IsRequired,
    string BusinessModel);

public sealed record FileUploadResponse(string FileId);

public sealed record QuoteResponse(string QuoteId);

public sealed record QuoteBatchResponse(IReadOnlyCollection<string> QuoteIds);
