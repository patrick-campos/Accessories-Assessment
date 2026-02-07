import { InformationSection } from "@/shared/ui/InformationSection";
import type { ItemDetails } from "../QuoteRequestController";
import type { FormSchema } from "../schema";
import { Input } from "@/shared/ui";
import { VerticalTableHeader } from "@/shared/ui/VerticalTableHeader";

type ReviewStepProps = {
  items: ItemDetails[];
  schema: FormSchema;
  user: { firstName: string; lastName: string; email: string };
  showErrors: boolean;
  onUpdateUser: (user: { firstName: string; lastName: string; email: string }) => void;
  onEditItem: (id: string) => void;
};

export function ReviewStep({ items, schema, user, showErrors, onUpdateUser, onEditItem }: ReviewStepProps) {
  const resolveLabel = (options: Array<{ value: string; label: string }>, value: string) =>
    options.find((option) => option.value === value)?.label ?? value;

  function RenderImages(item: ItemDetails): JSX.Element {
    
    return (
      <div className="grid max-sm:grid-cols-3 sm:grid-cols-5 gap-y-6 gap-x-3">
         {[...Object.values(item.photos), ...item.additionalPhotos].map((photo, index) => (
            <div className="flex justify-center w-full h-full">
              <img className="w-[10rem] h-[10rem]" src={`${photo}`}/>
            </div>
        ))}
      </div>
    )
  }

  function TransformItemToRecord(item:ItemDetails):Record<string, string>{
    return {
      Category: resolveLabel(schema.options.categories, item.category),
      Brand: resolveLabel(schema.options.brands, item.brand),
      Model: item.model,
      Size: resolveLabel(schema.options.sizes, item.size),
      Codition: resolveLabel(schema.options.conditions, item.condition),
      "Additional Information": item.additionalInfo,
    };
  }

  return (
    <section className="[&>*:not(:last-child)]:border-b">
      {items.map((item) => {
        return (
          <div>
            <InformationSection Title={'Your item details'} Item={TransformItemToRecord(item)} />
            <div className="pb-[5.8rem] border-default">
              <VerticalTableHeader className="mt-[4.8rem] pb-[1rem]" Title="Attached photos" />
              {RenderImages(item)}
            </div>
          </div>
        )
      })}

    </section>
  )



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
