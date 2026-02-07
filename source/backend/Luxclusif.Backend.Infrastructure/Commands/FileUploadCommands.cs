namespace Luxclusif.Backend.Infrastructure.Commands;

public static class FileUploadCommands
{
    public const string Insert = """
        INSERT INTO file_uploads (id, provider, external_id, location, photo_type, photo_subtype, description)
        VALUES (@Id::uuid, @Provider, @ExternalId, @Location, @PhotoType, @PhotoSubtype, @Description)
        """;
}
