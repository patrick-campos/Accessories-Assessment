import type { ItemDetails } from "../quoteRequestTypes";
import type { FormSchema } from "../schema";
import { Input, SelectSearchable, Textarea } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { DefaultText } from "@/shared/ui/DefaultText";

type DetailsStepProps = {
  schema: FormSchema;
  item: ItemDetails;
  showErrors: boolean;
  onUpdateItem: (partial: Partial<ItemDetails>) => void;
  dynamicAttributes: Array<{
    id: string;
    name: string;
    type: string;
    isRequired: boolean;
    displayOrder: number;
    options: Array<{ id: string; label: string }>;
  }>;
  onUpdateDynamicAttribute: (attributeId: string, values: string[]) => void;
};

export function DetailsStep({
  schema,
  item,
  showErrors,
  onUpdateItem,
  dynamicAttributes,
  onUpdateDynamicAttribute,
}: DetailsStepProps) {
  const shouldShowDetails = Boolean(item.category);
  const detailsClassName = shouldShowDetails ? "space-y-6" : "hidden";

  function RenderDynamicAttributesSection() {
    if (dynamicAttributes.length === 0) {
      return <></>;
    }

    return (
      <div className="space-y-6">
        {dynamicAttributes.map((attribute) => {
          return (
            <DynamicAttributeField
              key={attribute.id}
              attribute={attribute}
              item={item}
              showErrors={showErrors}
              onUpdateDynamicAttribute={onUpdateDynamicAttribute}
            />
          );
        })}
      </div>
    );
  }

  return (
    <>
      <SelectSearchable
        label="Country/region"
        required
        placeholder="Select country"
        options={schema.options.countries}
        value={item.country}
        error={showErrors && !item.country ? "Required" : undefined}
        onChange={(value) => onUpdateItem({ country: value })}
      />
      <SelectSearchable
        label="Category"
        required
        placeholder="Select category"
        options={schema.options.categories}
        value={item.category}
        error={showErrors && !item.category ? "Required" : undefined}
        onChange={(value) => onUpdateItem({ category: value })}
      />
      <div className={detailsClassName}>
        <SelectSearchable
          label="Brand"
          required
          placeholder="Select brand"
          options={schema.options.brands}
          value={item.brand}
          error={showErrors && !item.brand ? "Required" : undefined}
          onChange={(value) => onUpdateItem({ brand: value })}
        />
        <Input
          label="Model"
          placeholder="Enter model"
          value={item.model}
          error={showErrors && !item.model ? "Required" : undefined}
          onChange={(event) => onUpdateItem({ model: event.target.value })}
        />
        {RenderDynamicAttributesSection()}
        <Textarea
          label="Additional information"
          placeholder="Tell us anything else..."
          value={item.additionalInfo}
          onChange={(event) => onUpdateItem({ additionalInfo: event.target.value })}
        />
      </div>
    </>
  );
}

function DynamicAttributeField({
  attribute,
  item,
  showErrors,
  onUpdateDynamicAttribute,
}: {
  attribute: {
    id: string;
    name: string;
    type: string;
    isRequired: boolean;
    displayOrder: number;
    options: Array<{ id: string; label: string }>;
  };
  item: ItemDetails;
  showErrors: boolean;
  onUpdateDynamicAttribute: (attributeId: string, values: string[]) => void;
}) {
  const currentValues = item.dynamicAttributes[attribute.id] ?? [];
  const hasOptions = attribute.options.length > 0;
  const normalizedType = attribute.type.toLowerCase();
  const isMany = normalizedType === "manyof" || normalizedType === "anyof";
  const shouldShowError = showErrors && attribute.isRequired && currentValues.length === 0;
  const errorMessage = shouldShowError ? "Required" : undefined;

  if (hasOptions && !isMany) {
    return (
      <SelectSearchable
        label={attribute.name}
        required={attribute.isRequired}
        placeholder={`Select ${attribute.name}`}
        options={attribute.options.map((option) => ({ value: option.id, label: option.label }))}
        value={currentValues[0] ?? ""}
        error={errorMessage}
        onChange={(value) => onUpdateDynamicAttribute(attribute.id, MapSingleValue(value))}
      />
    );
  }

  if (hasOptions && isMany) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink">{attribute.name}</p>
        <div className="flex flex-wrap gap-3">
          {attribute.options.map((option) => {
            const isActive = currentValues.includes(option.id);
            const nextValues = isActive
              ? currentValues.filter((entry) => entry !== option.id)
              : [...currentValues, option.id];
            const className = ResolveChipClass(isActive);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onUpdateDynamicAttribute(attribute.id, nextValues)}
                className={className}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <DynamicError message={errorMessage} />
      </div>
    );
  }

  return (
    <Input
      label={attribute.name}
      placeholder={`Enter ${attribute.name}`}
      value={currentValues[0] ?? ""}
      error={errorMessage}
      onChange={(event) => onUpdateDynamicAttribute(attribute.id, MapSingleValue(event.target.value))}
    />
  );
}

function ResolveChipClass(isActive: boolean) {
  if (isActive) {
    return cn("rounded-full border px-4 py-2 text-xs font-semibold transition", "border-ink bg-ink text-mist");
  }
  return cn("rounded-full border px-4 py-2 text-xs font-semibold transition", "border-dune bg-mist text-ink");
}

function DynamicError({ message }: { message?: string }) {
  if (!message) {
    return <></>;
  }
  return (
    <DefaultText className="text-rose text-[0.9rem]">{message}</DefaultText>
  );
}

function MapSingleValue(value: string | undefined) {
  if (!value) {
    return [];
  }
  return [value];
}
