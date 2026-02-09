import { TitleText } from "@/shared/ui/Title";
import * as React from "react";
import type { DynamicQuestion, ItemDetails, PhotoSlot } from "../types/quoteRequestTypes";
import { DefaultText } from "@/shared/ui/DefaultText";
import { IMGSelector } from "../../../shared/ui/ImgSelector";
import { DynamicImagesSelect } from "@/shared/ui/DynamicImagesSelector";
import { DynamicQuestion as DynamicQuestionField } from "./DynamicQuestion";

type PhotosStepProps = {
  item: ItemDetails;
  showErrors: boolean;
  onUpdatePhoto: (slot: "front" | "back" | "bottom" | "interior", file: File | null) => void | Promise<void>;
  onUpdateDynamicPhoto: (attributeId: string, file: File | null) => void | Promise<void>;
  dynamicAttributes: DynamicQuestion[];
  onAddAdditionalPhoto: (file: File | null) => void | Promise<void>;
  onRemoveAdditionalPhoto: (index: number) => void;
};

const photoLabels = ["Front", "Back", "Bottom", "Interior"] as const;

function PhotoSlotCard({
  label,
  preview,
  isMissing,
  onSelect,
  isUploading,
}: {
  label: string;
  preview: string | null;
  isMissing: boolean;
  onSelect: (file: File | null) => void;
  isUploading?: boolean;
}) {
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
      <IMGSelector
        Label={label}
        OnSelect={onSelect}
        RemoveAction={handleRemove}
        IMGRef={preview}
        IsMissing={isMissing}
        MiddleLabel="Click to upload"
        isUploading={isUploading}
      />
    </div>
  );
}

function PhotoSlotUploader({
  slot,
  label,
  preview,
  isMissing,
  onUpdatePhoto,
}: {
  slot: PhotoSlot;
  label: string;
  preview: string | null;
  isMissing: boolean;
  onUpdatePhoto: (slot: PhotoSlot, file: File | null) => void | Promise<void>;
}) {
  const [isUploading, setIsUploading] = React.useState(false);

  const handleSelect = React.useCallback(
    async (file: File | null) => {
      if (!file) {
        await onUpdatePhoto(slot, null);
        return;
      }
      setIsUploading(true);
      try {
        await onUpdatePhoto(slot, file);
      } finally {
        setIsUploading(false);
      }
    },
    [onUpdatePhoto, slot]
  );

  return (
    <PhotoSlotCard
      label={label}
      preview={preview}
      isMissing={isMissing}
      onSelect={handleSelect}
      isUploading={isUploading}
    />
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
        const slot = label.toLowerCase() as PhotoSlot;
        const preview = item.photos[slot].previewUrl;
        const isMissing = showErrors && !item.photos[slot].fileId;
        return (
          <PhotoSlotUploader
            key={label}
            slot={slot}
            label={label}
            preview={preview}
            isMissing={isMissing}
            onUpdatePhoto={onUpdatePhoto}
          />
        );
      })}
    </div>
  );
}

function AdditionalPhotosUploader({
  images,
  onAddImage,
  onRemoveImage,
}: {
  images: Array<{ previewUrl: string }>;
  onAddImage: (file: File | null) => void | Promise<void>;
  onRemoveImage: (index: number) => void;
}) {
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAdd = React.useCallback(
    async (file: File | null) => {
      if (!file) return;
      setIsAdding(true);
      try {
        await onAddImage(file);
      } finally {
        setIsAdding(false);
      }
    },
    [onAddImage]
  );

  return (
    <DynamicImagesSelect
      images={images}
      onAddImage={handleAdd}
      onRemoveImage={onRemoveImage}
      isUploadingAdd={isAdding}
    />
  );
}

function DynamicPhotoSlot({
  attribute,
  item,
  showErrors,
  onUpdateDynamicPhoto,
}: {
  attribute: DynamicQuestion;
  item: ItemDetails;
  showErrors: boolean;
  onUpdateDynamicPhoto: (attributeId: string, file: File | null) => void | Promise<void>;
}) {
  const [isUploading, setIsUploading] = React.useState(false);

  const handleSelect = React.useCallback(
    async (file: File | null) => {
      if (!file) {
        await onUpdateDynamicPhoto(attribute.id, null);
        return;
      }
      setIsUploading(true);
      try {
        await onUpdateDynamicPhoto(attribute.id, file);
      } finally {
        setIsUploading(false);
      }
    },
    [attribute.id, onUpdateDynamicPhoto]
  );

  return (
    <DynamicQuestionField
      question={attribute}
      showErrors={showErrors}
      photo={item.dynamicPhotos[attribute.id]}
      onFileChange={handleSelect}
      isUploading={isUploading}
    />
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
  onUpdateDynamicPhoto: (attributeId: string, file: File | null) => void | Promise<void>;
}) {
  if (attributes.length === 0) {
    return <></>;
  }

  return (
    <div className="grid gap-4 max-sm:grid-cols-2 lg:grid-cols-4 max-lg:grid-cols-3">
      {attributes.map((attribute) => (
        <DynamicPhotoSlot
          key={attribute.id}
          attribute={attribute}
          item={item}
          showErrors={showErrors}
          onUpdateDynamicPhoto={onUpdateDynamicPhoto}
        />
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
        <DefaultText className="mt-[1.2rem] text-secondaryTitle">
          Please submit at least 4 photos of your item. Click one of photos below to upload your own. You can drag the photos to change their order or click to delete them.
        </DefaultText>
        <PhotoSlotsGrid item={item} showErrors={showErrors} onUpdatePhoto={onUpdatePhoto} />
      </div>

      <div className="space-y-3">
        <TitleText className="font-normal text-heading">Additional photos</TitleText>
        <DefaultText className="mt-[1.2rem] text-secondaryTitle">
          You'll need to add photos of any wear and damage. Make sure to include any hardware, 'made in' tags and serial numbers. You can add up to 16 photos - the more you provide, the more accurate your quote.
        </DefaultText>
        <AdditionalPhotosUploader
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
        <DefaultText className="text-secondaryTitle">
          We may be unable to accept your bag if the photos you provide don’t accurately represent it. If this happens, we'll return the bag to your collection address free of charge.
        </DefaultText>
      </div>
    </div>
  );
}

