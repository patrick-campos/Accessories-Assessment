import { TitleText } from "@/shared/ui/Title";
import * as React from "react";
import type { DynamicQuestion, ItemDetails } from "../types/quoteRequestTypes";
import { cn } from "@/shared/lib/cn";
import { DefaultText } from "@/shared/ui/DefaultText";
import { IMGSelector } from "../../../shared/ui/ImgSelector";
import { DynamicImagesSelect } from "@/shared/ui/DynamicImagesSelector";
import { DynamicQuestion as DynamicQuestionField } from "./DynamicQuestion";

type PhotosStepProps = {
  item: ItemDetails;
  showErrors: boolean;
  onUpdatePhoto: (slot: "front" | "back" | "bottom" | "interior", file: File | null) => void;
  onUpdateDynamicPhoto: (attributeId: string, file: File | null) => void;
  dynamicAttributes: DynamicQuestion[];
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
    "flex h-[15.5rem] w-[15.5rem] flex-col items-center justify-center gap-3 rounded-sm border-[0.1rem] border-dashed px-4 py-6 text-center text-xs text-clay max-lg:m-auto",
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

function PhotoSlotsGrid({
  item,
  showErrors,
  onUpdatePhoto,
}: {
  item: ItemDetails;
  showErrors: boolean;
  onUpdatePhoto: PhotosStepProps["onUpdatePhoto"];
}) {
  return (
    <div className="grid gap-4 max-sm:grid-cols-2 xl:grid-cols-4 max-xl:grid-cols-3">
      {photoLabels.map((label) => {
        const slot = label.toLowerCase() as "front" | "back" | "bottom" | "interior";
        const preview = item.photos[slot].previewUrl;
        const isMissing = showErrors && !item.photos[slot].fileId;
        return (
          <PhotoSlotCard
            key={label}
            label={label}
            preview={preview}
            isMissing={isMissing}
            onSelect={(file) => onUpdatePhoto(slot, file)}
          />
        );
      })}
    </div>
  );
}

function AdditionalPhotoGrid({
  photos,
  onRemove,
}: {
  photos: Array<{ previewUrl: string }>;
  onRemove: (index: number) => void;
}) {
  if (photos.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {photos.map((photo, index) => (
        <div key={`${photo}-${index}`} className="relative h-24 w-full overflow-hidden rounded-2xl">
          <img src={photo.previewUrl} alt={`Additional ${index + 1}`} className="h-full w-full object-cover" />
          <button
            type="button"
            className="absolute right-2 top-2 rounded-xs bg-ink/70 px-2 py-1 text-[10px] text-mist"
            onClick={() => onRemove(index)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export function PhotosStep({
  item,
  showErrors,
  onUpdatePhoto,
  onUpdateDynamicPhoto,
  dynamicAttributes,
  onAddAdditionalPhoto,
  onRemoveAdditionalPhoto,
}: PhotosStepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <TitleText className="font-normal text-heading">Photos of your item</TitleText>
        <DefaultText className="mt-[1.2rem] text-secondaryTitle">Please submit at least 4 photos of your item. Click one of photos below to upload your
          own. You can drag the photos to change their order or click to delete them.</DefaultText>
        <PhotoSlotsGrid item={item} showErrors={showErrors} onUpdatePhoto={onUpdatePhoto} />
      </div>

      <div className="space-y-3">
        <TitleText className="font-normal text-heading">Additional photos</TitleText>
        <DefaultText className="mt-[1.2rem] text-secondaryTitle">You'll need to add photos of any wear and damage. Make sure to include any hardware,
          'made in' tags and serial numbers. You can add up to 16 photos â€“ the more you provide,
          the more accurate your quote.</DefaultText>
        <DynamicImagesSelect
          images={item.additionalPhotos}
          onAddImage={onAddAdditionalPhoto}
          onRemoveImage={onRemoveAdditionalPhoto}
        />
      </div>
      <DynamicPhotoSlots
        attributes={dynamicAttributes}
        item={item}
        showErrors={showErrors}
        onUpdateDynamicPhoto={onUpdateDynamicPhoto}
      />

      <div className="pt-8">
        <TitleText className="font-normal text-secondaryTitle font-bold">Important information</TitleText>
        <DefaultText className="text-secondaryTitle">We may be unable to accept your bag if the photos you provide don’t accurately represent it. If this happens, we'll return the bag to your collection address free of charge.</DefaultText>
      </div>
    </div>
  );
}

function DynamicPhotoSlots({
  attributes,
  item,
  showErrors,
  onUpdateDynamicPhoto,
}: {
  attributes: DynamicQuestion[];
  item: ItemDetails;
  showErrors: boolean;
  onUpdateDynamicPhoto: (attributeId: string, file: File | null) => void;
}) {
  if (attributes.length === 0) {
    return <></>;
  }

  return (
    <div className="grid gap-4 max-sm:grid-cols-2 lg:grid-cols-4 max-lg:grid-cols-3">
      {attributes.map((attribute) => {
        return (
          <DynamicQuestionField
            key={attribute.id}
            question={attribute}
            showErrors={showErrors}
            photo={item.dynamicPhotos[attribute.id]}
            onFileChange={(file) => onUpdateDynamicPhoto(attribute.id, file)}
          />
        );
      })}
    </div>
  );
}


