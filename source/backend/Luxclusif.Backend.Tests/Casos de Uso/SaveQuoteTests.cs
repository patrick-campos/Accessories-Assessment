using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Abstractions.Services;
using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Application.UseCases.Quotes;
using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Tests.Casos_de_Uso;

public sealed class SaveQuoteTests
{
    [Fact]
    public async Task ValidateSaveQuoteReturnsQuoteIdDeveTerSucesso()
    {
        var countryRepository = new InMemoryCountryRepository();
        var quoteRepository = new InMemoryQuoteRepository();
        var spreadsheetService = new InMemorySpreadsheetService();
        var unitOfWork = new FakeUnitOfWork();

        var useCase = new SaveQuote(countryRepository, quoteRepository, spreadsheetService, unitOfWork);

        var request = new QuoteRequestDto(
            "GB",
            new CustomerInformationDto("Tier", "Jane", "Doe", "jane.doe@example.com"),
            new List<QuoteItemDto>
            {
                new(
                    new List<QuoteItemAttributeDto>(),
                    "category",
                    "brand",
                    "Model",
                    "Description",
                    new List<QuoteItemFileDto>
                    {
                        new("Photos", "FileAPI", "1", "", new QuoteItemFileMetadataDto("None", "Front", "")),
                        new("Photos", "FileAPI", "2", "", new QuoteItemFileMetadataDto("None", "Back", "")),
                        new("Photos", "FileAPI", "3", "", new QuoteItemFileMetadataDto("None", "Bottom", "")),
                        new("Photos", "FileAPI", "4", "", new QuoteItemFileMetadataDto("None", "Inside", ""))
                    })
            });

        var response = await useCase.ExecuteAsync(request, CancellationToken.None);

        Assert.False(string.IsNullOrWhiteSpace(response.QuoteId));
        Assert.Single(quoteRepository.Items);
        Assert.Single(spreadsheetService.Items);
    }

    private sealed class InMemoryCountryRepository : ICountryRepository
    {
        public Task<IReadOnlyCollection<Country>> GetAllAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult<IReadOnlyCollection<Country>>(new List<Country>());
        }

        public Task<bool> ExistsAsync(string isoCode, CancellationToken cancellationToken)
        {
            return Task.FromResult(true);
        }
    }

    private sealed class InMemoryQuoteRepository : IQuoteRepository
    {
        public List<Quote> Items { get; } = new();

        public Task SaveAsync(Quote quote, CancellationToken cancellationToken)
        {
            Items.Add(quote);
            return Task.CompletedTask;
        }
    }

    private sealed class InMemorySpreadsheetService : ISpreadsheetService
    {
        public List<Quote> Items { get; } = new();

        public Task AppendQuoteAsync(Quote quote, CancellationToken cancellationToken)
        {
            Items.Add(quote);
            return Task.CompletedTask;
        }
    }

    private sealed class FakeUnitOfWork : IUnitOfWork
    {
        public Task ExecuteAsync(Func<CancellationToken, Task> action, CancellationToken cancellationToken)
        {
            return action(cancellationToken);
        }
    }
}
