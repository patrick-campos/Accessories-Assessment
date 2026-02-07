using Luxclusif.Backend.Application.Abstractions.Services;

namespace Luxclusif.Backend.Infrastructure.Services;

public sealed class SystemClock : IClock
{
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}
