using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Abstractions.Services;
using Luxclusif.Backend.Infrastructure.Database;
using Luxclusif.Backend.Infrastructure.Repositories;
using Luxclusif.Backend.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Luxclusif.Backend.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton(new NpgsqlConnectionFactory(configuration));
        services.AddScoped<ICountryRepository, CountryRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IBrandRepository, BrandRepository>();
        services.AddScoped<IAttributeRepository, AttributeRepository>();
        services.AddScoped<IFileUploadRepository, FileUploadRepository>();
        services.AddScoped<IQuoteRepository, QuoteRepository>();
        services.AddScoped<IUnitOfWork, NpgsqlUnitOfWork>();

        services.AddScoped<IClock, SystemClock>();
        services.AddScoped<IFileStorageService, GoogleDriveFileStorageService>();
        services.AddScoped<ISpreadsheetService, GoogleSheetService>();
        services.AddSingleton<GoogleApiClientFactory>();
        services.Configure<GoogleDriveOptions>(configuration.GetSection("GoogleDrive"));
        services.Configure<GoogleSheetOptions>(configuration.GetSection("GoogleSheet"));

        services.AddSingleton<MigrationRunner>();

        return services;
    }
}
