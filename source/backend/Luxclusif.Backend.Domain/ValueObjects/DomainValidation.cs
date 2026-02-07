using System.Text.RegularExpressions;
using Luxclusif.Backend.Domain.Exceptions;

namespace Luxclusif.Backend.Domain.ValueObjects;

public static class DomainValidation
{
    private static readonly Regex EmailRegex = new("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", RegexOptions.Compiled);

    public static void Required(string? value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new DomainException($"{fieldName} is required.");
        }
    }

    public static void Required(object? value, string fieldName)
    {
        if (value is null)
        {
            throw new DomainException($"{fieldName} is required.");
        }
    }

    public static void MaxLength(string value, int maxLength, string fieldName)
    {
        if (value.Length > maxLength)
        {
            throw new DomainException($"{fieldName} must be at most {maxLength} characters.");
        }
    }

    public static void ExactLength(string value, int length, string fieldName)
    {
        if (value.Length != length)
        {
            throw new DomainException($"{fieldName} must be {length} characters.");
        }
    }

    public static void ValidEmail(string value, string fieldName)
    {
        if (!EmailRegex.IsMatch(value))
        {
            throw new DomainException($"{fieldName} must be a valid email.");
        }
    }

    public static void NotEmpty<T>(IReadOnlyCollection<T> items, string fieldName)
    {
        if (items.Count == 0)
        {
            throw new DomainException($"{fieldName} must have at least one item.");
        }
    }
}
