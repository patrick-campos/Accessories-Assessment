import { IMGSelector } from "@/shared/ui/ImgSelector";
import React from "react";

type DynamicImagesSelectProps = {
  images: Array<{ previewUrl: string }>;
  onAddImage: (file: File | null) => void;
  onRemoveImage: (index: number) => void;
};

export function DynamicImagesSelect({
  images,
  onAddImage,
  onRemoveImage,
}: DynamicImagesSelectProps): JSX.Element {
  function RenderImagesSelected(image: { previewUrl: string } | null, index: number): JSX.Element {
    if (!image) return <></>;
    return (
      <IMGSelector
        key={`DynamicImagesSelector-${index}`}
        IMGRef={image.previewUrl}
        RemoveAction={() => onRemoveImage(index)}
      />
    );
  }

  return (
    <div className="grid flex-col w-full h-full max-sm:grid-cols-2 max-lg:grid-cols-3 lg:grid-cols-4 gap-3 max-lg:justify-between">
      {images?.map((image, index) => RenderImagesSelected(image, index))}
      <IMGSelector OnSelect={onAddImage} MiddleLabel={"Click to upload"} />
    </div>
  );
}
