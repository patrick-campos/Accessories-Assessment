import type { ItemDetails } from "../QuoteRequestController";
import { cn } from "@/shared/lib/cn";

type PhotosStepProps = {
  item: ItemDetails;
  showErrors: boolean;
  onUpdatePhoto: (slot: "front" | "back" | "bottom" | "interior", file: File | null) => void;
  onAddAdditionalPhotos: (files: FileList | null) => void;
  onRemoveAdditionalPhoto: (index: number) => void;
};

const photoLabels = ["Front", "Back", "Bottom", "Interior"] as const;

export function PhotosStep({
  item,
  showErrors,
  onUpdatePhoto,
  onAddAdditionalPhotos,
  onRemoveAdditionalPhoto,
}: PhotosStepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink">Photos of your item</p>
        <p className="text-xs text-clay">
          Please submit at least 4 photos of your item. Click one of photos below to upload your
          own. You can drag the photos to change their order or click to delete them.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {photoLabels.map((label) => {
            const slot = label.toLowerCase() as "front" | "back" | "bottom" | "interior";
            const preview = item.photos[slot];
            const isMissing = showErrors && !preview;
            return (
              <label
                key={label}
                className={cn(
                  "flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-4 py-6 text-center text-xs text-clay",
                  preview ? "border-ink bg-mist" : "border-dune bg-white",
                  isMissing ? "border-rose" : ""
                )}
              >
                {preview ? (
                  <img src={preview} alt={label} className="h-32 w-full rounded-2xl object-cover" />
                ) : (
                  <span>Click to upload</span>
                )}
                <span className="font-semibold text-ink">{label}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => onUpdatePhoto(slot, event.target.files?.[0] ?? null)}
                />
                {isMissing ? <span className="text-[10px] text-rose">Required</span> : null}
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink">Additional photos</p>
        <p className="text-xs text-clay">
          You'll need to add photos of any wear and damage. Make sure to include any hardware,
          'made in' tags and serial numbers. You can add up to 16 photos - the more you provide,
          the more accurate your quote.
        </p>
        <label className="flex min-h-[140px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-dune bg-mist px-6 text-center text-xs text-clay">
          <span>Drag and drop or click to upload</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(event) => onAddAdditionalPhotos(event.target.files)}
          />
        </label>
        {item.additionalPhotos.length ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {item.additionalPhotos.map((photo, index) => (
              <div key={`${photo}-${index}`} className="relative h-24 w-full overflow-hidden rounded-2xl">
                <img src={photo} alt={`Additional ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-1 text-[10px] text-mist"
                  onClick={() => onRemoveAdditionalPhoto(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-ink">Important information</p>
        <p className="text-xs text-clay">
          We may be unable to accept your bag if the photos you provide don’t accurately represent
          it. If this happens, we'll return the bag to your collection address free of charge.
        </p>
      </div>
    </div>
  );
}
