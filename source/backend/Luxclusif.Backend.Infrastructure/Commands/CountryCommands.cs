namespace Luxclusif.Backend.Infrastructure.Commands;

public static class CountryCommands
{
    public const string SelectAll = "SELECT iso_code AS IsoCode, name AS Name FROM countries ORDER BY name";
    public const string ExistsByIsoCode = "SELECT COUNT(1) FROM countries WHERE iso_code = @IsoCode";
}
