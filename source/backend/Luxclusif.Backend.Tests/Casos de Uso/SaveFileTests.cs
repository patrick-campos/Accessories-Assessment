using Luxclusif.Backend.Application.Abstractions.Repositories;
using Luxclusif.Backend.Application.Abstractions.Services;
using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Application.UseCases.Files;
using Luxclusif.Backend.Domain.Entities;

namespace Luxclusif.Backend.Tests.Casos_de_Uso;

public sealed class SaveFileTests
{
    [Fact]
    public async Task ValidateSaveFileReturnsFileIdDeveTerSucesso()
    {
        var storageService = new FakeFileStorageService();
        var repository = new InMemoryFileUploadRepository();
        var clock = new FakeClock();
        var useCase = new SaveFile(storageService, repository, clock);

        await using var stream = new MemoryStream(new byte[] { 1, 2, 3 });
        var request = new FileUploadRequest("file.png", "image/png", stream);

        var response = await useCase.ExecuteAsync(request, CancellationToken.None);

        Assert.False(string.IsNullOrWhiteSpace(response.FileId));
        Assert.Single(repository.Items);
    }

    private sealed class FakeFileStorageService : IFileStorageService
    {
        public Task<FileStorageResult> SaveAsync(string fileName, string contentType, Stream content, DateTimeOffset ttl, CancellationToken cancellationToken)
        {
            return Task.FromResult(new FileStorageResult("GoogleDrive", Guid.NewGuid().ToString(), "/tmp/file"));
        }
    }

    private sealed class InMemoryFileUploadRepository : IFileUploadRepository
    {
        public List<FileUpload> Items { get; } = new();

        public Task SaveAsync(FileUpload fileUpload, CancellationToken cancellationToken)
        {
            Items.Add(fileUpload);
            return Task.CompletedTask;
        }
    }

    private sealed class FakeClock : IClock
    {
        public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
    }
}
