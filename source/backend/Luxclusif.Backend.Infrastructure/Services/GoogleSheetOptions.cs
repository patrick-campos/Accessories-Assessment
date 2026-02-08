namespace Luxclusif.Backend.Infrastructure.Services;

public sealed class GoogleSheetOptions
{
    public string SpreadsheetId { get; set; } = string.Empty;
    public string SheetName { get; set; } = "Quotes";
}
