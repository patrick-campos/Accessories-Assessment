using System.Data;
using Dapper;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Luxclusif.Backend.Application.Abstractions.Services;
using Luxclusif.Backend.Domain.Entities;
using Luxclusif.Backend.Infrastructure.Database;
using Microsoft.Extensions.Options;
using Npgsql;

namespace Luxclusif.Backend.Infrastructure.Services;

public sealed class GoogleSheetService : ISpreadsheetService
{
    private readonly GoogleSheetOptions _options;
    private readonly GoogleDriveOptions _driveOptions;
    private readonly SheetsService _sheetsService;
    private readonly NpgsqlConnectionFactory _connectionFactory;

    public GoogleSheetService(
        IOptions<GoogleSheetOptions> options,
        IOptions<GoogleDriveOptions> driveOptions,
        NpgsqlConnectionFactory connectionFactory)
    {
        _options = options.Value;
        _driveOptions = driveOptions.Value;
        _sheetsService = CreateSheetsService(_driveOptions);
        _connectionFactory = connectionFactory;
    }

    public async Task AppendQuoteAsync(Quote quote, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.SpreadsheetId))
        {
            throw new InvalidOperationException("GoogleSheet SpreadsheetId is missing.");
        }

        var sheetName = string.IsNullOrWhiteSpace(_options.SheetName) ? "Quotes" : _options.SheetName;
        var range = string.IsNullOrWhiteSpace(sheetName)
            ? "A:Q"
            : $"{sheetName}!A:Q";

        var lookups = await BuildLookupsAsync(quote, cancellationToken);
        await EnsureHeaderAsync(sheetName, cancellationToken);

        var rows = BuildRows(quote, lookups);
        if (rows.Count == 0)
        {
            return;
        }

        var valueRange = new ValueRange { Values = rows };
        var request = _sheetsService.Spreadsheets.Values.Append(valueRange, _options.SpreadsheetId, range);
        request.ValueInputOption = SpreadsheetsResource.ValuesResource.AppendRequest.ValueInputOptionEnum.RAW;
        request.InsertDataOption = SpreadsheetsResource.ValuesResource.AppendRequest.InsertDataOptionEnum.INSERTROWS;

        await request.ExecuteAsync(cancellationToken);
    }

    private static SheetsService CreateSheetsService(GoogleDriveOptions options)
    {
        if (string.IsNullOrWhiteSpace(options.ClientId) ||
            string.IsNullOrWhiteSpace(options.ClientSecret) ||
            string.IsNullOrWhiteSpace(options.RefreshToken))
        {
            throw new InvalidOperationException("Google OAuth credentials are missing.");
        }

        var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = options.ClientId,
                ClientSecret = options.ClientSecret
            },
            Scopes = [SheetsService.Scope.Spreadsheets]
        });

        var token = new TokenResponse
        {
            RefreshToken = options.RefreshToken
        };

        var credential = new UserCredential(flow, "user", token);

        return new SheetsService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = options.ApplicationName
        });
    }

    private static readonly string[] SizeKeys = ["size"];
    private static readonly string[] ConditionKeys = ["condition", "state"];
    private static readonly string[] ExtrasKeys = ["extra", "accessor", "extras"];

    private static readonly IReadOnlyList<string> Header =
    [
        "CreatedAt",
        "CountryOfOrigin",
        "CustomerEmail",
        "ItemsCount",
        "ItemIndex",
        "CategoryName",
        "BrandName",
        "Model",
        "Description",
        "Size",
        "Condition",
        "Extras",
        "PhotoLinks"
    ];

    private async Task EnsureHeaderAsync(string sheetName, CancellationToken cancellationToken)
    {
        var range = $"{sheetName}!A1:Q1";
        var response = await _sheetsService.Spreadsheets.Values.Get(_options.SpreadsheetId, range)
            .ExecuteAsync(cancellationToken);

        if (response.Values is { Count: > 0 } && response.Values[0].Count > 0)
        {
            return;
        }

        var valueRange = new ValueRange
        {
            Values = [Header.Cast<object>().ToList()]
        };

        var request = _sheetsService.Spreadsheets.Values.Update(valueRange, _options.SpreadsheetId, range);
        request.ValueInputOption = SpreadsheetsResource.ValuesResource.UpdateRequest.ValueInputOptionEnum.RAW;
        await request.ExecuteAsync(cancellationToken);
    }

    private sealed record AttributeInfo(string Name, string Key);

    private sealed record LookupData(
        IReadOnlyDictionary<string, string> Categories,
        IReadOnlyDictionary<string, string> Brands,
        IReadOnlyDictionary<string, AttributeInfo> Attributes);

    private async Task<LookupData> BuildLookupsAsync(Quote quote, CancellationToken cancellationToken)
    {
        var categoryIds = quote.Items.Select(item => item.CategoryId)
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Distinct()
            .ToArray();

        var brandIds = quote.Items.Select(item => item.BrandId)
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Distinct()
            .ToArray();

        var attributeIds = quote.Items.SelectMany(item => item.Attributes)
            .Select(attribute => attribute.AttributeId)
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Distinct()
            .ToArray();

        await using var connection = _connectionFactory.Create();
        await connection.OpenAsync(cancellationToken);

        var categories = await LoadLookupAsync(connection, "categories", categoryIds, cancellationToken);
        var brands = await LoadLookupAsync(connection, "brands", brandIds, cancellationToken);
        var attributes = await LoadAttributesAsync(connection, attributeIds, cancellationToken);

        return new LookupData(categories, brands, attributes);
    }

    private static async Task<IReadOnlyDictionary<string, string>> LoadLookupAsync(
        NpgsqlConnection connection,
        string table,
        IReadOnlyCollection<string> ids,
        CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
        {
            return new Dictionary<string, string>();
        }

        var guidIds = ids.Select(Guid.Parse).ToArray();
        var sql = $"SELECT id, name FROM {table} WHERE id = ANY(@Ids)";
        var command = new CommandDefinition(sql, new { Ids = guidIds }, cancellationToken: cancellationToken);
        var rows = await connection.QueryAsync<LookupRow>(command);
        return rows.ToDictionary(row => row.Id.ToString(), row => row.Name);
    }

    private static async Task<IReadOnlyDictionary<string, AttributeInfo>> LoadAttributesAsync(
        NpgsqlConnection connection,
        IReadOnlyCollection<string> ids,
        CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
        {
            return new Dictionary<string, AttributeInfo>();
        }

        var guidIds = ids.Select(Guid.Parse).ToArray();
        var sql = "SELECT id, name, key FROM category_attributes WHERE id = ANY(@Ids)";
        var command = new CommandDefinition(sql, new { Ids = guidIds }, cancellationToken: cancellationToken);
        var rows = await connection.QueryAsync<AttributeRow>(command);
        return rows.ToDictionary(
            row => row.Id.ToString(),
            row => new AttributeInfo(row.Name ?? string.Empty, row.Key ?? string.Empty));
    }

    private static List<IList<object>> BuildRows(Quote quote, LookupData lookups)
    {
        var rows = new List<IList<object>>();
        var itemIndex = 0;
        foreach (var item in quote.Items)
        {
            itemIndex += 1;
            var categoryName = lookups.Categories.TryGetValue(item.CategoryId, out var catName) ? catName : string.Empty;
            var brandName = lookups.Brands.TryGetValue(item.BrandId, out var brName) ? brName : string.Empty;

            var size = ResolveAttributeValues(item, lookups.Attributes, SizeKeys);
            var condition = ResolveAttributeValues(item, lookups.Attributes, ConditionKeys);
            var extras = ResolveAttributeValues(item, lookups.Attributes, ExtrasKeys);

            var allFiles = item.Files
                .Select(file => file.Location)
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .ToList();

            rows.Add(new List<object>
            {
                quote.CreatedAt.ToString("O"),
                quote.CountryOfOriginIsoCode,
                quote.Customer.Email,
                quote.Items.Count,
                itemIndex,
                categoryName,
                brandName,
                item.Model,
                item.Description,
                size,
                condition,
                extras,
                string.Join("; ", allFiles)
            });
        }

        return rows;
    }

    private static string ResolveAttributeValues(
        Item item,
        IReadOnlyDictionary<string, AttributeInfo> attributes,
        IReadOnlyCollection<string> keys)
    {
        var values = new List<string>();

        foreach (var attribute in item.Attributes)
        {
            if (!attributes.TryGetValue(attribute.AttributeId, out var info))
            {
                continue;
            }

            var haystack = $"{info.Key} {info.Name}".ToLowerInvariant();
            if (!keys.Any(key => haystack.Contains(key)))
            {
                continue;
            }

            values.AddRange(attribute.Values.Select(value => value.Label));
        }

        return string.Join(", ", values);
    }

    private sealed record LookupRow(Guid Id, string Name);
    private sealed record AttributeRow(Guid Id, string? Name, string? Key);
}
