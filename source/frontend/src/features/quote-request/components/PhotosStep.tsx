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
    "flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-4 py-6 text-center text-xs text-clay",
    preview ? "border-ink bg-mist" : "border-dune bg-white",
    isMissing ? "border-rose" : ""
  );
  return (
    <label className={cardClasses}>
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
        onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
      />
      <RequiredHint isMissing={isMissing} />
    </label>
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
    <div className="grid gap-4 sm:grid-cols-2">
      {photoLabels.map((label) => {
        const slot = label.toLowerCase() as "front" | "back" | "bottom" | "interior";
        const preview = item.photos[slot];
        const isMissing = showErrors && !preview;
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
  photos: string[];
  onRemove: (index: number) => void;
}) {
  if (photos.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {photos.map((photo, index) => (
        <div key={`${photo}-${index}`} className="relative h-24 w-full overflow-hidden rounded-2xl">
          <img src={photo} alt={`Additional ${index + 1}`} className="h-full w-full object-cover" />
          <button
            type="button"
            className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-1 text-[10px] text-mist"
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
        <PhotoSlotsGrid item={item} showErrors={showErrors} onUpdatePhoto={onUpdatePhoto} />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink">Additional photos</p>
        <p className="text-xs text-clay">
          You'll need to add photos of any wear and damage. Make sure to include any hardware,
          'made in' tags and serial numbers. You can add up to 16 photos â€“ the more you provide,
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
        <AdditionalPhotoGrid photos={item.additionalPhotos} onRemove={onRemoveAdditionalPhoto} />
      </div>

      <div className="p-0">
        <p className="text-xs text-clay">
          Your uploads will appear here once added. Make sure all four required angles are included.
        </p>
      </div>
    </div>
  );
}
