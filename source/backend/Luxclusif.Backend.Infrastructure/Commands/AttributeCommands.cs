namespace Luxclusif.Backend.Infrastructure.Commands;

public static class AttributeCommands
{
    public const string SelectByCategory = """
        SELECT id AS Id,
               name AS Name,
               key AS Key,
               display_order AS DisplayOrder,
               type AS Type,
               is_required AS IsRequired,
               business_model AS BusinessModel
        FROM category_attributes
        WHERE category_id = @CategoryId
        ORDER BY display_order
        """;

    public const string SelectOptionsByAttributeIds = """
        SELECT id AS Id,
               attribute_id AS AttributeId,
               name AS Name,
               key AS Key,
               display_order AS DisplayOrder,
               output_label AS OutputLabel
        FROM attribute_options
        WHERE attribute_id = ANY(@AttributeIds)
        ORDER BY display_order
        """;
}
