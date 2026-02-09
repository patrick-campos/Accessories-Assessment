import type { DynamicQuestion, ItemDetails } from "../types/quoteRequestTypes";
import type { FormSchema } from "../schema";
import { Input, SelectSearchable, Textarea } from "@/shared/ui";
import { DynamicQuestion as DynamicQuestionField } from "./DynamicQuestion";

type DetailsStepProps = {
  schema: FormSchema;
  item: ItemDetails;
  showErrors: boolean;
  onUpdateItem: (partial: Partial<ItemDetails>) => void;
  dynamicAttributes: DynamicQuestion[];
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
            <DynamicQuestionField
              key={attribute.id}
              question={attribute}
              showErrors={showErrors}
              values={item.dynamicAttributes[attribute.id] ?? []}
              onChange={(values) => onUpdateDynamicAttribute(attribute.id, values)}
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
