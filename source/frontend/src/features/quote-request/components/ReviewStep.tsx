import { InformationSection } from "@/shared/ui/InformationSection";
import type { ItemDetails } from "../types/quoteRequestTypes";
import type { FormSchema } from "../schema";
import { VerticalTableHeader } from "@/shared/ui/VerticalTableHeader";

type ReviewStepProps = {
  items: ItemDetails[];
  schema: FormSchema;
  user: { firstName: string; lastName: string; email: string };
  showErrors: boolean;
  onUpdateUser: (user: { firstName: string; lastName: string; email: string }) => void;
  onEditItem: (id: string) => void;
  onEditPhotos: (id: string) => void;
};

export function ReviewStep({
  items,
  schema,
  user,
  showErrors,
  onUpdateUser,
  onEditItem,
  onEditPhotos,
}: ReviewStepProps) {
  const resolveLabel = (options: Array<{ value: string; label: string }>, value: string) =>
    options.find((option) => option.value === value)?.label ?? value;

  function RenderImages(item: ItemDetails): JSX.Element {
    return (
      <div className="grid max-sm:grid-cols-3 sm:grid-cols-5 gap-y-6 gap-x-3">
        {[...Object.values(item.photos).map((photo) => photo.previewUrl), ...item.additionalPhotos.map((photo) => photo.previewUrl)]
          .filter((photo): photo is string => Boolean(photo))
          .map((photo, index) => (
            <div key={`${item.id}-photo-${index}`} className="flex justify-center w-full h-full">
              <img className="w-[10rem] h-[10rem]" src={`${photo}`} />
            </div>
          ))}
      </div>
    );
  }

  function TransformItemToRecord(item: ItemDetails): Record<string, string> {
    return {
      Category: resolveLabel(schema.options.categories, item.category),
      Brand: resolveLabel(schema.options.brands, item.brand),
      Model: item.model,
      "Additional Information": item.additionalInfo,
    };
  }

  return (
    <section className="[&>*:not(:last-child)]:border-b">
      {items.map((item) => {
        return (
          <div key={item.id}>
            <InformationSection
              Title={"Your Item details"}
              Item={TransformItemToRecord(item)}
              OnEdit={() => onEditItem(item.id)}
            />
            <div className="pb-[5.8rem] border-default">
              <VerticalTableHeader
                className="mt-lg pb-[1rem]"
                Title="Attached photos"
                OnClick={() => onEditPhotos(item.id)}
              />
              {RenderImages(item)}
            </div>
          </div>
        );
      })}
    </section>
  );
}
