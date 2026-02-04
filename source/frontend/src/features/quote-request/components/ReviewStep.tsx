import type { ItemDetails } from "../QuoteRequestController";
import { Input } from "@/shared/ui";

type ReviewStepProps = {
  items: ItemDetails[];
  user: { firstName: string; lastName: string; email: string };
  showErrors: boolean;
  onUpdateUser: (user: { firstName: string; lastName: string; email: string }) => void;
  onEditItem: (id: string) => void;
};

export function ReviewStep({ items, user, showErrors, onUpdateUser, onEditItem }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4 p-0">
        <Input
          label="First name"
          value={user.firstName}
          error={showErrors && !user.firstName ? "Required" : undefined}
          onChange={(event) => onUpdateUser({ ...user, firstName: event.target.value })}
        />
        <Input
          label="Last name"
          value={user.lastName}
          error={showErrors && !user.lastName ? "Required" : undefined}
          onChange={(event) => onUpdateUser({ ...user, lastName: event.target.value })}
        />
        <Input
          label="Email"
          type="email"
          value={user.email}
          error={showErrors && !user.email ? "Required" : undefined}
          onChange={(event) => onUpdateUser({ ...user, email: event.target.value })}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-ink">Your item details</h2>
        {items.map((item) => (
          <div key={item.id} className="border border-dune bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{item.brand || "Item"}</p>
              <button
                type="button"
                className="text-xs font-semibold text-ink underline"
                onClick={() => onEditItem(item.id)}
              >
                Edit
              </button>
            </div>
            <div className="mt-4 grid gap-2 text-xs text-clay">
              <p>
                <span className="font-semibold text-ink">Category:</span> {item.category}
              </p>
              <p>
                <span className="font-semibold text-ink">Brand:</span> {item.brand}
              </p>
              <p>
                <span className="font-semibold text-ink">Model:</span> {item.model}
              </p>
              <p>
                <span className="font-semibold text-ink">Size:</span> {item.size}
              </p>
              <p>
                <span className="font-semibold text-ink">Condition:</span> {item.condition}
              </p>
              <p>
                <span className="font-semibold text-ink">Additional information:</span>{" "}
                {item.additionalInfo || "—"}
              </p>
              <div>
                <span className="font-semibold text-ink">Attached Photos:</span>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[...Object.values(item.photos), ...item.additionalPhotos].map((photo, index) => (
                    <div
                      key={`${item.id}-photo-${index}`}
                      className="relative h-16 w-full overflow-hidden rounded-xl bg-mist"
                    >
                      {photo ? (
                        <img src={photo} alt="Photo" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-clay">
                          —
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-clay">
        By completing this form and clicking above, you agree to FARFETCH Second Life{" "}
        <a href="#">Terms of Sale</a> and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}
