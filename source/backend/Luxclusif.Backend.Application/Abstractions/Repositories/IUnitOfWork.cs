namespace Luxclusif.Backend.Application.Abstractions.Repositories;

public interface IUnitOfWork
{
    Task ExecuteAsync(Func<CancellationToken, Task> action, CancellationToken cancellationToken);
}
