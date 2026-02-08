namespace Luxclusif.Backend.Infrastructure.Commands;

public static class QuoteQueryCommands
{
    public const string CountQuotes = """
        SELECT COUNT(*) FROM quotes
        """;

    public const string SelectQuotesPage = """
        SELECT id AS Id,
               country_of_origin_iso_code AS CountryOfOriginIsoCode,
               created_at AS CreatedAt
        FROM quotes
        ORDER BY created_at DESC
        OFFSET @Offset
        LIMIT @Limit
        """;

    public const string SelectQuoteDetails = """
        SELECT id AS Id,
               quote_id AS QuoteId,
               external_seller_tier AS ExternalSellerTier,
               first_name AS FirstName,
               last_name AS LastName,
               email AS Email
        FROM customers
        WHERE quote_id = ANY(@QuoteIds);

        SELECT id AS Id,
               quote_id AS QuoteId,
               category_id AS CategoryId,
               brand_id AS BrandId,
               model AS Model,
               description AS Description
        FROM items
        WHERE quote_id = ANY(@QuoteIds);

        SELECT ia.id AS Id,
               ia.item_id AS ItemId,
               ia.attribute_id AS AttributeId,
               ca.name AS AttributeName
        FROM item_attributes ia
        JOIN items i ON i.id = ia.item_id
        JOIN category_attributes ca ON ca.id = ia.attribute_id
        WHERE i.quote_id = ANY(@QuoteIds);

        SELECT iav.item_attribute_id AS ItemAttributeId,
               iav.value_id AS ValueId,
               iav.label AS Label
        FROM item_attribute_values iav
        JOIN item_attributes ia ON ia.id = iav.item_attribute_id
        JOIN items i ON i.id = ia.item_id
        WHERE i.quote_id = ANY(@QuoteIds);

        SELECT f.id AS Id,
               f.item_id AS ItemId,
               f.external_id AS ExternalId,
               f.location AS Location,
               fu.external_id AS UploadExternalId,
               fu.location AS UploadLocation,
               f.photo_type AS PhotoType,
               f.photo_subtype AS PhotoSubtype,
               f.description AS Description
        FROM item_files f
        JOIN items i ON i.id = f.item_id
        LEFT JOIN file_uploads fu ON fu.id::text = f.external_id
        WHERE i.quote_id = ANY(@QuoteIds);

        SELECT c.id AS Id, c.name AS Name
        FROM categories c
        JOIN items i ON i.category_id = c.id
        WHERE i.quote_id = ANY(@QuoteIds);

        SELECT b.id AS Id, b.name AS Name
        FROM brands b
        JOIN items i ON i.brand_id = b.id
        WHERE i.quote_id = ANY(@QuoteIds);
        """;
}
