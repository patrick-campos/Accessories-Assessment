using Luxclusif.Backend.Api.Middleware;
using Luxclusif.Backend.Application.UseCases.Attributes;
using Luxclusif.Backend.Application.UseCases.Brands;
using Luxclusif.Backend.Application.UseCases.Categories;
using Luxclusif.Backend.Application.UseCases.Countries;
using Luxclusif.Backend.Application.UseCases.Files;
using Luxclusif.Backend.Application.UseCases.Quotes;
using Luxclusif.Backend.Infrastructure.Database;
using Luxclusif.Backend.Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .AddJsonFile("app.settings.json", optional: true, reloadOnChange: true)
    .AddJsonFile("app.settings.release.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
    options.AddPolicy("default", policy =>
    {
        if (allowedOrigins is { Length: > 0 })
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
        else
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddScoped<GetCountries>();
builder.Services.AddScoped<GetCategories>();
builder.Services.AddScoped<GetBrands>();
builder.Services.AddScoped<GetCategoryAttributes>();
builder.Services.AddScoped<SaveFile>();
builder.Services.AddScoped<DeleteFile>();
builder.Services.AddScoped<GetQuotes>();
builder.Services.AddScoped<SaveQuote>();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("default");

var swaggerEnabled = app.Configuration.GetValue("Swagger:Enabled", true);
if (swaggerEnabled)
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Luxclusif Backend v1");
    });
}

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var migrationRunner = scope.ServiceProvider.GetRequiredService<MigrationRunner>();
    await migrationRunner.RunAsync(CancellationToken.None);
}

app.Run();
