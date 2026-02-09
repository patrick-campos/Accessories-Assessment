using Luxclusif.Backend.Api.Controllers;
using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Abstractions.Services;
using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Application.UseCases.Quotes;
using Luxclusif.Backend.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;

namespace Luxclusif.Backend.Tests.Casos_de_Uso;

public sealed class QuotesControllerTests
{
    [Fact]
    public async Task CreateAsync_CreatesOneQuotePerItemWithDistinctData()
    {
        var countryRepository = new InMemoryCountryRepository();
        var quoteRepository = new InMemoryQuoteRepository();
        var fileUploadRepository = new InMemoryFileUploadRepository();
        var spreadsheetService = new InMemorySpreadsheetService();
        var unitOfWork = new FakeUnitOfWork();

        var useCase = new SaveQuote(
            countryRepository,
            fileUploadRepository,
            quoteRepository,
            spreadsheetService,
            unitOfWork);

        var controller = new QuotesController();
        var request = new QuoteRequestDto(
            "US",
            new CustomerInformationDto(null, "Alicia", "Morris", "alicia@example.com"),
            new List<QuoteItemDto>
            {
                new(
                    new List<QuoteItemAttributeDto>(),
                    "cat-1",
                    "brand-1",
                    "Model One",
                    "First item",
                    new List<QuoteItemFileDto>
                    {
                        new("Photos", "FileAPI", "1", "http://file-1", new QuoteItemFileMetadataDto("None", "Front", "")),
                        new("Photos", "FileAPI", "2", "http://file-2", new QuoteItemFileMetadataDto("None", "Back", "")),
                        new("Photos", "FileAPI", "3", "http://file-3", new QuoteItemFileMetadataDto("None", "Bottom", "")),
                        new("Photos", "FileAPI", "4", "http://file-4", new QuoteItemFileMetadataDto("None", "Inside", ""))
                    }),
                new(
                    new List<QuoteItemAttributeDto>(),
                    "cat-2",
                    "brand-2",
                    "Model Two",
                    "Second item",
                    new List<QuoteItemFileDto>
                    {
                        new("Photos", "FileAPI", "5", "http://file-5", new QuoteItemFileMetadataDto("None", "Front", "")),
                        new("Photos", "FileAPI", "6", "http://file-6", new QuoteItemFileMetadataDto("None", "Back", "")),
                        new("Photos", "FileAPI", "7", "http://file-7", new QuoteItemFileMetadataDto("None", "Bottom", "")),
                        new("Photos", "FileAPI", "8", "http://file-8", new QuoteItemFileMetadataDto("None", "Inside", ""))
                    })
            });

        var result = await controller.CreateAsync(
            request,
            useCase,
            NullLogger<QuotesController>.Instance,
            CancellationToken.None);

        var response = Assert.IsType<QuoteBatchResponse>(Assert.IsType<OkObjectResult>(result.Result).Value);
        Assert.Equal(2, response.QuoteIds.Count);
        Assert.Equal(2, quoteRepository.Items.Count);

        var firstQuote = quoteRepository.Items[0];
        var secondQuote = quoteRepository.Items[1];

        var firstItem = Assert.Single(firstQuote.Items);
        var secondItem = Assert.Single(secondQuote.Items);

        Assert.NotEqual(firstItem.Model, secondItem.Model);
        Assert.NotEqual(firstItem.Description, secondItem.Description);
        Assert.NotEqual(firstItem.BrandId, secondItem.BrandId);
        Assert.NotEqual(firstItem.CategoryId, secondItem.CategoryId);
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

        public Task<PagedQuoteList> GetAllAsync(int page, int pageSize, CancellationToken cancellationToken)
        {
            return Task.FromResult(new PagedQuoteList(0, Array.Empty<QuoteListItemDto>()));
        }
    }

    private sealed class InMemoryFileUploadRepository : IFileUploadRepository
    {
        public Task SaveAsync(FileUpload fileUpload, CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        public Task<FileUpload?> GetByIdAsync(string id, CancellationToken cancellationToken)
        {
            return Task.FromResult<FileUpload?>(null);
        }

        public Task DeleteAsync(string id, CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }

    private sealed class InMemorySpreadsheetService : ISpreadsheetService
    {
        public Task AppendQuoteAsync(Quote quote, CancellationToken cancellationToken)
        {
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
