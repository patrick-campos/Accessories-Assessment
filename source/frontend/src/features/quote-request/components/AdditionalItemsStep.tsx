import { DefaultText } from "@/shared/ui/DefaultText";
import type { ItemDetails } from "../QuoteRequestController";
import { Button } from "@/shared/ui";
import { Plus } from "lucide-react";

type AdditionalItemsStepProps = {
  items: ItemDetails[];
  brandOptions: Array<{ value: string; label: string }>;
  onAddAnother: () => void;
};

export function AdditionalItemsStep({ items, brandOptions, onAddAnother }: AdditionalItemsStepProps) {
  const resolveBrandLabel = (value: string) =>
    brandOptions.find((option) => option.value === value)?.label ?? value;

  function RenderItemInformationPart(item: ItemDetails, index: number) {
    return (
      <div key={`ItemInformationPart-${index}`} className="flex flex-col justify-center">
        <DefaultText className="align-center text-normal text-secondaryTitle">
          {resolveBrandLabel(item.brand)}
        </DefaultText>
        <DefaultText className="align-center text-normal text-secondaryTitle">{item.model}</DefaultText>
      </div>
    )
  }

  function RenderItemImagePart(item: ItemDetails, index: number): JSX.Element {
    return (
      <div key={`ItemImagePart-${index}`}>
        <img className="w-[10rem] h-[10rem] rounded-[0.8rem]" src={item.photos.front.previewUrl ?? ""} />
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        {items.map((item, index) => {
          return (
            <div key={`AdditionalItem-${index}`} className="flex gap-5 border-solid border-default w-full p-[1.2rem] border rounded-[0.8rem]">
              {RenderItemImagePart(item, index)}
              {RenderItemInformationPart(item, index)}
            </div>
          )
        })}
      </div>
      <div className="mt-[2.4rem] mb-[2.8rem]">
        <button
        type="button"
        onClick={onAddAnother}
        className="w-full border-dashed border border-default rounded-[0.8rem] h-full"
      >
        <div className="flex flex-col justify-center gap-3 items-center p-[2.4rem]">
          <Plus/>
          <DefaultText className="">Add more Items</DefaultText>
        </div>
      </button>
      </div>
    </div>
  );
}