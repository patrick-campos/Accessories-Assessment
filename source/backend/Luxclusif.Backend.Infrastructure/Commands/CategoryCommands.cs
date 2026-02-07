namespace Luxclusif.Backend.Infrastructure.Commands;

public static class CategoryCommands
{
    public const string SelectByFilters = """
        SELECT id AS Id, name AS Name
        FROM categories
        WHERE country_iso_code = @CountryIsoCode
          AND has_available_buyer = @HasAvailableBuyer
        ORDER BY name
        """;
}
