import type { DynamicQuestion, ItemDetails } from "../types/quoteRequestTypes";
import type { FormSchema } from "../schema";
import { DetailsStep } from "./DetailsStep";
import { PhotosStep } from "./PhotosStep";
import { AdditionalItemsStep } from "./AdditionalItemsStep";
import { ReviewStep } from "./ReviewStep";

type StepViewsArgs = {
  schema: FormSchema;
  currentItem: ItemDetails;
  items: ItemDetails[];
  user: { firstName: string; lastName: string; email: string };
  showErrors: boolean;
  detailAttributes: DynamicQuestion[];
  photoAttributes: DynamicQuestion[];
  onUpdateItem: (partial: Partial<ItemDetails>) => void;
  onUpdatePhoto: (slot: "front" | "back" | "bottom" | "interior", file: File | null) => void;
  onUpdateDynamicPhoto: (attributeId: string, file: File | null) => void;
  onUpdateDynamicAttribute: (attributeId: string, values: string[]) => void;
  onAddAdditionalPhoto: (file: File | null) => void;
  onRemoveAdditionalPhoto: (index: number) => void;
  onUpdateUser: (user: { firstName: string; lastName: string; email: string }) => void;
  onAddAnother: () => void;
  onEditItem: (id: string) => void;
  onEditPhotos: (id: string) => void;
};

export function buildQuoteRequestStepViews({
  schema,
  currentItem,
  items,
  user,
  showErrors,
  detailAttributes,
  photoAttributes,
  onUpdateItem,
  onUpdatePhoto,
  onUpdateDynamicPhoto,
  onUpdateDynamicAttribute,
  onAddAdditionalPhoto,
  onRemoveAdditionalPhoto,
  onUpdateUser,
  onAddAnother,
  onEditItem,
  onEditPhotos,
}: StepViewsArgs) {
  return [
    (
      <DetailsStep
        schema={schema}
        item={currentItem}
        showErrors={showErrors}
        onUpdateItem={onUpdateItem}
        dynamicAttributes={detailAttributes}
        onUpdateDynamicAttribute={onUpdateDynamicAttribute}
      />
    ),
    (
      <PhotosStep
        item={currentItem}
        showErrors={showErrors}
        onUpdatePhoto={onUpdatePhoto}
        dynamicAttributes={photoAttributes}
        onUpdateDynamicPhoto={onUpdateDynamicPhoto}
        onAddAdditionalPhoto={onAddAdditionalPhoto}
        onRemoveAdditionalPhoto={onRemoveAdditionalPhoto}
      />
    ),
    <AdditionalItemsStep items={items} brandOptions={schema.options.brands} onAddAnother={onAddAnother} />,
    (
      <ReviewStep
        items={items}
        schema={schema}
        user={user}
        showErrors={showErrors}
        onUpdateUser={onUpdateUser}
        onEditItem={onEditItem}
        onEditPhotos={onEditPhotos}
      />
    ),
  ];
}
