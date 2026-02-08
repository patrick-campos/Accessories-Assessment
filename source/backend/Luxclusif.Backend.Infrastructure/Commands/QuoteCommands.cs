namespace Luxclusif.Backend.Infrastructure.Commands;

public static class QuoteCommands
{
    public const string InsertQuote = """
        INSERT INTO quotes (id, country_of_origin_iso_code, created_at)
        VALUES (@Id::uuid, @CountryOfOriginIsoCode, @CreatedAt)
        """;

    public const string InsertCustomer = """
        INSERT INTO customers (id, quote_id, external_seller_tier, first_name, last_name, email)
        VALUES (@Id::uuid, @QuoteId::uuid, @ExternalSellerTier, @FirstName, @LastName, @Email)
        """;

    public const string InsertItem = """
        INSERT INTO items (id, quote_id, category_id, brand_id, model, description)
        VALUES (@Id::uuid, @QuoteId::uuid, @CategoryId::uuid, @BrandId::uuid, @Model, @Description)
        """;

    public const string InsertItemAttribute = """
        INSERT INTO item_attributes (id, item_id, attribute_id)
        VALUES (@Id::uuid, @ItemId::uuid, @AttributeId::uuid)
        """;

    public const string InsertItemAttributeValue = """
        INSERT INTO item_attribute_values (id, item_attribute_id, value_id, label)
        VALUES (@Id::uuid, @ItemAttributeId::uuid, @ValueId::uuid, @Label)
        """;

    public const string InsertItemFile = """
        INSERT INTO item_files (id, item_id, type, provider, external_id, location, photo_type, photo_subtype, description)
        VALUES (@Id::uuid, @ItemId::uuid, @Type, @Provider, @ExternalId, @Location, @PhotoType, @PhotoSubtype, @Description)
        """;
}
