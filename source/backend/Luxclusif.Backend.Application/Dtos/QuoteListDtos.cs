namespace Luxclusif.Backend.Application.Dtos;

public sealed record PagedQuoteList(int TotalItems, IReadOnlyCollection<QuoteListItemDto> Items);

public sealed record QuoteListResponseDto(
    int CurrentPage,
    int TotalPages,
    int TotalItems,
    int PageSize,
    IReadOnlyCollection<QuoteListItemDto> Items);

public sealed record QuoteListItemDto(
    string Id,
    DateTimeOffset CreatedAt,
    DateTimeOffset? LastUpdatedAt,
    string Status,
    string ExternalId,
    string Reference,
    string CountryOfOrigin,
    string CurrencyIsoCode,
    QuoteCustomerInformationDto CustomerInformation,
    QuoteSellerDto Seller,
    IReadOnlyCollection<QuoteListItemDetailDto> Items);

public sealed record QuoteCustomerInformationDto(
    string? ExternalUserId,
    long? ExternalUserNumericId,
    string FirstName,
    string LastName,
    string Email,
    string? TelephoneNumber,
    string? ExternalSellerTier,
    bool IsVipCustomer);

public sealed record QuoteSellerDto(string Id, string Name);

public sealed record QuoteListItemDetailDto(
    string SubmissionId,
    string Id,
    DateTimeOffset CreatedAt,
    DateTimeOffset? LastUpdatedAt,
    string ExternalId,
    string Status,
    QuoteLookupDto Category,
    QuoteLookupDto Brand,
    string Model,
    string Description,
    IReadOnlyCollection<QuoteListAttributeDto> Attributes,
    IReadOnlyCollection<QuoteListFileDto> Files,
    IReadOnlyCollection<string>? RejectionReasons,
    IReadOnlyCollection<string>? CancellationReasons,
    IReadOnlyCollection<object> Offers,
    decimal? Price,
    DateTimeOffset? RejectedAt,
    DateTimeOffset? CanceledAt,
    DateTimeOffset? TimedOutAt,
    DateTimeOffset? MoreInformationRequestedAt,
    DateTimeOffset? MoreInformationReceivedAt);

public sealed record QuoteLookupDto(string Id, string Name);

public sealed record QuoteListAttributeDto(
    string Id,
    string Name,
    IReadOnlyCollection<QuoteListAttributeValueDto> Values);

public sealed record QuoteListAttributeValueDto(string Id, string Label);

public sealed record QuoteListFileDto(
    string Id,
    string Location,
    QuoteListFileMetadataDto Metadata);

public sealed record QuoteListFileMetadataDto(
    string PhotoType,
    string Description,
    string PhotoSubtype);
