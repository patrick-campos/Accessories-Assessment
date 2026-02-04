import type { ItemDetails } from "../QuoteRequestController";

type AdditionalItemsStepProps = {
  items: ItemDetails[];
  onAddAnother: () => void;
};

export function AdditionalItemsStep({ items, onAddAnother }: AdditionalItemsStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="border border-dune p-4">
            <div className="relative h-32 w-full overflow-hidden bg-white">
              {item.photos.front ? (
                <img src={item.photos.front} alt="Front" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-clay">No photo</div>
              )}
            </div>
            <div className="mt-3 text-sm font-semibold text-ink">{item.brand || "Item"}</div>
            <div className="text-xs text-clay">{item.model || "Model"}</div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAddAnother}
        className="flex w-full items-center justify-center border-2 border-dashed border-dune bg-white px-6 py-10 text-sm font-semibold text-ink"
      >
        Drag and drop to add another item
      </button>
    </div>
  );
}
