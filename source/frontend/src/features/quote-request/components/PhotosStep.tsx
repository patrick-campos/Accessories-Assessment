import { TitleText } from "@/shared/ui/Title";
import * as React from "react";
import type { ItemDetails } from "../QuoteRequestController";
import { cn } from "@/shared/lib/cn";
import { DefaultText } from "@/shared/ui/DefaultText";
import { IMGSelector } from "../../../shared/ui/ImgSelector";
import { DynamicImagesSelect } from "@/shared/ui/DynamicImagesSelector";

type PhotosStepProps = {
  item: ItemDetails;
  showErrors: boolean;
  onUpdatePhoto: (slot: "front" | "back" | "bottom" | "interior", file: File | null) => void;
  onAddAdditionalPhoto: (file: File | null) => void;
  onRemoveAdditionalPhoto: (index: number) => void;
};

const photoLabels = ["Front", "Back", "Bottom", "Interior"] as const;

function RequiredHint({ isMissing }: { isMissing: boolean }) {
  if (!isMissing) return null;
  return <span className="text-[10px] text-rose">Required</span>;
}

function PhotoSlotCard({
  label,
  preview,
  isMissing,
  onSelect,
}: {
  label: string;
  preview: string | null;
  isMissing: boolean;
  onSelect: (file: File | null) => void;
}) {
  const cardClasses = cn(
    "flex h-[15.5rem] w-[15.5rem] flex-col items-center justify-center gap-3 rounded-[0.8rem] border-[0.1rem] border-dashed px-4 py-6 text-center text-xs text-clay max-lg:m-auto",
    preview ? "border-ink bg-white" : "border-default bg-white mb-[0.6rem] cursor-pointer",
    isMissing ? "border-rose" : ""
  );
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  function handleRemove(event?: React.MouseEvent<HTMLButtonElement>) {
    event?.preventDefault();
    onSelect(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }
  return (
    <div className="max-lg:m-auto">
      <IMGSelector Label={label} OnSelect={onSelect} RemoveAction={handleRemove} IMGRef={preview} IsMissing={isMissing}/>
     </div>
  );
}