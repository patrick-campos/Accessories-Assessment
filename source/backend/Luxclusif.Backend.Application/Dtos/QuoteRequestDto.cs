using System.Text.Json.Serialization;

namespace Luxclusif.Backend.Application.Dtos;

public sealed record QuoteRequestDto(
    [property: JsonPropertyName("countryOfOrigin")] string CountryOfOrigin,
    [property: JsonPropertyName("customerInformation")] CustomerInformationDto CustomerInformation,
    [property: JsonPropertyName("items")] IReadOnlyCollection<QuoteItemDto> Items);

public sealed record CustomerInformationDto(
    [property: JsonPropertyName("externalSellerTier")] string? ExternalSellerTier,
    [property: JsonPropertyName("firstName")] string FirstName,
    [property: JsonPropertyName("lastName")] string LastName,
    [property: JsonPropertyName("email")] string Email);

public sealed record QuoteItemDto(
    [property: JsonPropertyName("attributes")] IReadOnlyCollection<QuoteItemAttributeDto> Attributes,
    [property: JsonPropertyName("categoryId")] string CategoryId,
    [property: JsonPropertyName("brandId")] string BrandId,
    [property: JsonPropertyName("model")] string Model,
    [property: JsonPropertyName("description")] string Description,
    [property: JsonPropertyName("files")] IReadOnlyCollection<QuoteItemFileDto> Files);

public sealed record QuoteItemAttributeDto(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("values")] IReadOnlyCollection<QuoteItemAttributeValueDto> Values);

public sealed record QuoteItemAttributeValueDto(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("label")] string Label);

public sealed record QuoteItemFileDto(
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("provider")] string Provider,
    [property: JsonPropertyName("externalId")] string ExternalId,
    [property: JsonPropertyName("location")] string Location,
    [property: JsonPropertyName("metadata")] QuoteItemFileMetadataDto Metadata);

public sealed record QuoteItemFileMetadataDto(
    [property: JsonPropertyName("PhotoType")] string PhotoType,
    [property: JsonPropertyName("PhotoSubtype")] string PhotoSubtype,
    [property: JsonPropertyName("Description")] string Description);
