import type { ItemDetails } from "./QuoteRequestController";
import type { FormSchema } from "./schema";
import { Button, MasterHeader, Stepper } from "@/shared/ui";
import { AuxiliarySections } from "./components/AuxiliarySections";
import { DetailsStep } from "./components/DetailsStep";
import { PhotosStep } from "./components/PhotosStep";
import { AdditionalItemsStep } from "./components/AdditionalItemsStep";
import { ReviewStep } from "./components/ReviewStep";

type Props = {
  schema: FormSchema;
  isLoading: boolean;
  error: string | null;
  currentStep: number;
  showErrors: boolean;
  currentItem: ItemDetails;
  items: ItemDetails[];
  user: { firstName: string; lastName: string; email: string };
  submitState: "idle" | "sending" | "error" | "success";
  onUpdateItem: (partial: Partial<ItemDetails>) => void;
  onUpdatePhoto: (slot: "front" | "back" | "bottom" | "interior", file: File | null) => void;
  onAddAdditionalPhotos: (files: FileList | null) => void;
  onRemoveAdditionalPhoto: (index: number) => void;
  onUpdateUser: (user: { firstName: string; lastName: string; email: string }) => void;
  onNext: () => void;
  onBack: () => void;
  onAddAnother: () => void;
  onEditItem: (id: string) => void;
};

export function QuoteRequestView({
  schema,
  isLoading,
  error,
  currentStep,
  showErrors,
  currentItem,
  items,
  user,
  submitState,
  onUpdateItem,
  onUpdatePhoto,
  onAddAdditionalPhotos,
  onRemoveAdditionalPhoto,
  onUpdateUser,
  onNext,
  onBack,
  onAddAnother,
  onEditItem,
}: Props) {
  const step = schema.steps[currentStep];
  const showBack = currentStep > 0;
  const isLast = currentStep === schema.steps.length - 1;
  const shouldShowNext = currentStep !== 0 || Boolean(currentItem.category);

  const stepViews = {
    0: (
      <DetailsStep
        schema={schema}
        item={currentItem}
        showErrors={showErrors}
        onUpdateItem={onUpdateItem}
      />
    ),
    1: (
      <PhotosStep
        item={currentItem}
        showErrors={showErrors}
        onUpdatePhoto={onUpdatePhoto}
        onAddAdditionalPhotos={onAddAdditionalPhotos}
        onRemoveAdditionalPhoto={onRemoveAdditionalPhoto}
      />
    ),
    2: <AdditionalItemsStep items={items} onAddAnother={onAddAnother} />,
    3: (
      <ReviewStep
        items={items}
        user={user}
        showErrors={showErrors}
        onUpdateUser={onUpdateUser}
        onEditItem={onEditItem}
      />
    ),
  } as const;

  const stepContent = stepViews[currentStep as 0 | 1 | 2 | 3] ?? stepViews[0];

  return (
    <div className="min-h-screen bg-white text-ink">
      <MasterHeader />

      <main className="w-full px-[5%] py-10 xl:w-[144rem]">
        <div className="flex flex-col gap-3">
          <Stepper steps={schema.steps.map((item) => item.headerTitle)} currentIndex={currentStep} />
          {step?.headerNote ? <p className="text-sm text-clay">{step.headerNote}</p> : null}
        </div>

        <div className="mt-10 flex flex-col gap-10 xl:flex-row xl:justify-between">
          <section className="w-full space-y-8 bg-transparent p-0 xl:max-w-[67.4rem]">
            <div>
              <h1 className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-ink">
                {step?.inputTitle}
              </h1>
              {step?.inputSubtitle ? (
                <p className="mt-3 font-[var(--font-body)] text-sm text-clay">
                  {step.inputSubtitle}
                </p>
              ) : null}
            </div>

            {isLoading ? <p className="text-sm text-clay">Carregando perguntas...</p> : null}
            {error ? <p className="text-sm text-rose">{error}</p> : null}

            {stepContent}

            <div className="flex flex-wrap gap-4 pt-4">
              {showBack ? (
                <Button variant="outline" type="button" onClick={onBack}>
                  Back
                </Button>
              ) : null}
              {shouldShowNext ? (
                <Button type="button" onClick={onNext} disabled={submitState === "sending"}>
                  {isLast ? "Request Quote" : "Next"}
                </Button>
              ) : null}
              {submitState === "error" ? (
                <span className="text-xs text-rose">Falha no envio. Tente novamente.</span>
              ) : null}
              {submitState === "success" ? (
                <span className="text-xs text-ink">Pedido enviado com sucesso.</span>
              ) : null}
            </div>
          </section>

          <aside className="w-full bg-transparent p-0 xl:w-[35.3rem] min-[1440px]:w-[39.3rem]">
            <AuxiliarySections step={step} />
          </aside>
        </div>
      </main>
    </div>
  );
}
