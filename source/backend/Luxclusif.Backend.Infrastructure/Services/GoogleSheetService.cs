using System.Text;
using Luxclusif.Backend.Application.Abstractions.Services;
using Luxclusif.Backend.Domain.Entities;
using Microsoft.Extensions.Options;

namespace Luxclusif.Backend.Infrastructure.Services;

public sealed class GoogleSheetService : ISpreadsheetService
{
    private readonly GoogleSheetOptions _options;

    public GoogleSheetService(IOptions<GoogleSheetOptions> options)
    {
        _options = options.Value;
    }

    public async Task AppendQuoteAsync(Quote quote, CancellationToken cancellationToken)
    {
        var path = Path.Combine(AppContext.BaseDirectory, _options.OutputPath);
        var directory = Path.GetDirectoryName(path);
        if (!string.IsNullOrWhiteSpace(directory))
        {
            Directory.CreateDirectory(directory);
        }

        var line = new StringBuilder()
            .Append(quote.Id).Append(',')
            .Append(quote.CountryOfOriginIsoCode).Append(',')
            .Append(quote.Customer.Email).Append(',')
            .Append(quote.Items.Count).Append(',')
            .Append(quote.CreatedAt.ToString("O"))
            .ToString();

        await File.AppendAllTextAsync(path, line + Environment.NewLine, cancellationToken);
    }
}
