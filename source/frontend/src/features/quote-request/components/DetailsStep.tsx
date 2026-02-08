import type { ItemDetails } from "../QuoteRequestController";
import type { FormSchema } from "../schema";
import { Input, SelectSearchable, Textarea } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { ContainerStep } from "./ContainerStep";
import { TitleText } from "@/shared/ui/Title";
import { DefaultText } from "@/shared/ui/DefaultText";

type DetailsStepProps = {
  schema: FormSchema;
  item: ItemDetails;
  showErrors: boolean;
  onUpdateItem: (partial: Partial<ItemDetails>) => void;
};

export function DetailsStep({ schema, item, showErrors, onUpdateItem }: DetailsStepProps) {
  const shouldShowDetails = Boolean(item.category);
  const detailsClassName = shouldShowDetails ? "space-y-6" : "hidden";

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
        <SelectSearchable
          label="Size"
          required
          placeholder="Select size"
          options={schema.options.sizes}
          value={item.size}
          error={showErrors && !item.size ? "Required" : undefined}
          onChange={(value) => onUpdateItem({ size: value })}
        />
        <SelectSearchable
          label="Condition"
          required
          placeholder="Select condition"
          options={schema.options.conditions}
          value={item.condition}
          error={showErrors && !item.condition ? "Required" : undefined}
          onChange={(value) => onUpdateItem({ condition: value })}
        />
        <div className="space-y-3">
          <p className="text-sm font-semibold text-ink">Extras</p>
          <div className="flex flex-wrap gap-3">
            {schema.options.extras.map((extra) => {
              const isActive = item.extras.includes(extra.value);
              const nextExtras = isActive
                ? item.extras.filter((entry) => entry !== extra.value)
                : [...item.extras, extra.value];
              return (
                <button
                  key={extra.value}
                  type="button"
                  onClick={() => onUpdateItem({ extras: nextExtras })}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-semibold transition",
                    isActive ? "border-ink bg-ink text-mist" : "border-dune bg-mist text-ink"
                  )}
                >
                  {extra.label}
                </button>
              );
            })}
          </div>
        </div>
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
