namespace Luxclusif.Backend.Infrastructure.Commands;

public static class BrandCommands
{
    public const string SelectByFilters = """
        SELECT id AS Id, name AS Name
        FROM brands
        WHERE category_id = @CategoryId
          AND country_iso_code = @CountryIsoCode
          AND has_available_buyer = @HasAvailableBuyer
        ORDER BY name
        """;
}
