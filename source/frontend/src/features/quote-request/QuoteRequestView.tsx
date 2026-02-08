import type { ItemDetails } from "./QuoteRequestController";
import type { FormSchema } from "./schema";
import { Button, MasterHeader, Modal } from "@/shared/ui";
import { AuxiliarySections } from "./components/AuxiliarySections";
import { DetailsStep } from "./components/DetailsStep";
import { PhotosStep } from "./components/PhotosStep";
import { AdditionalItemsStep } from "./components/AdditionalItemsStep";
import { ReviewStep } from "./components/ReviewStep";
import { TitleText } from "@/shared/ui/Title";
import { DefaultText } from "@/shared/ui/DefaultText";
import { ContentContainer } from "@/shared/ui/ContentContainer";
import { HeaderStep } from "./components/HeaderStep";
import { TwoGridContainer } from "@/shared/ui/TwoGridContainer";
import { ContainerStep } from "./components/ContainerStep";
import { ButtonStep } from "./components/ButtonsStep";

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
  isUploading: boolean;
  showSuccessModal: boolean;
  onUpdateItem: (partial: Partial<ItemDetails>) => void;
  onUpdatePhoto: (slot: "front" | "back" | "bottom" | "interior", file: File | null) => void;
  onAddAdditionalPhoto: (file: File | null) => void;
  onRemoveAdditionalPhoto: (index: number) => void;
  onUpdateUser: (user: { firstName: string; lastName: string; email: string }) => void;
  onNext: () => void;
  onBack: () => void;
  onAddAnother: () => void;
  onEditItem: (id: string) => void;
  onEditPhotos: (id: string) => void;
  onCloseSuccessModal: () => void;
  onRequestAnotherQuote: () => void;
  onMyQuotes: () => void;
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
  isUploading,
  showSuccessModal,
  onUpdateItem,
  onUpdatePhoto,
  onAddAdditionalPhoto,
  onRemoveAdditionalPhoto,
  onUpdateUser,
  onNext,
  onBack,
  onAddAnother,
  onEditItem,
  onEditPhotos,
  onCloseSuccessModal,
  onRequestAnotherQuote,
  onMyQuotes,
}: Props) {
  const step = schema.steps[currentStep];
  const showBack = currentStep > 0;
  const isLast = currentStep === schema.steps.length - 1;
  const shouldShowNext = currentStep !== 0 || Boolean(currentItem.category);
  let successModal: React.ReactNode = null;
  if (showSuccessModal) {
    successModal = (
      <Modal
        isOpen={showSuccessModal}
        title="We'll be in touch soon"
        message="We'll contact you within the next 3 working days with you quote. You'll then be able to view It in My Quotes."
        onClose={onCloseSuccessModal}
        secondaryAction={
          <Button variant="ghost" type="button" onClick={onRequestAnotherQuote}>
            Request Another Quote
          </Button>
        }
        primaryAction={
          <Button type="button" onClick={onMyQuotes}>
            My Quotes
          </Button>
        }
      />
    );
  }

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
        onAddAdditionalPhoto={onAddAdditionalPhoto}
        onRemoveAdditionalPhoto={onRemoveAdditionalPhoto}
      />
    ),
    2: <AdditionalItemsStep items={items} brandOptions={schema.options.brands} onAddAnother={onAddAnother} />,
    3: (
      <ReviewStep
        items={items}
        schema={schema}
        user={user}
        showErrors={showErrors}
        onUpdateUser={onUpdateUser}
        onEditItem={onEditItem}
        onEditPhotos={onEditPhotos}
      />
    ),
  } as const;

  const stepContent = stepViews[currentStep as 0 | 1 | 2 | 3] ?? stepViews[0];

  return (
    <section className="h-screen w-screen">
      <MasterHeader />
      {successModal}
      <ContentContainer>
        <HeaderStep Items={schema.steps.map((item) => item.headerTitle)} CurrentIndexOfActiveItem={currentStep} />
        <TwoGridContainer className="xl:w-[144rem] lg:m-auto">
          <ContainerStep className="space-y-6">
            <div className="mb-[4.8rem]">
              <TitleText className="font-normal text-title">{step?.inputTitle}</TitleText>
              <DefaultText className="mt-[1.2rem] text-subtitle">{step.inputSubtitle}</DefaultText>
            </div>
            {stepContent}
            <div className="flex justify-end pt-[6.2rem] max-sm:grid-cols-2 max-sm:flex-col max-sm:gap-8 max-sm:justify-center max-sm:pt-[2rem]">
              <ButtonStep variant="outline" shouldRender={showBack} onClick={onBack} className="rounded-[0.5rem] px-[5.8rem] min-w-[4.4rem] mr-[2rem] mb-0.8rem max-sm:w-full max-sm:mr-0">Back</ButtonStep>
              <ButtonStep shouldRender={shouldShowNext}  onClick={onNext} disabled={submitState === "sending" || isUploading} className="rounded-[0.5rem] px-[5.8rem] min-w-[4.4rem] max-sm:w-full">{isLast ? 'Request Quote':'Next'}</ButtonStep>
            </div>
          </ContainerStep>
          <aside className="w-full bg-transparent max-xl:py-[4.8rem] xl:w-[35.3rem] min-[1440px]:w-[39.3rem] max-lg:my-[4.8rem]">
            <AuxiliarySections step={step} />
          </aside>
        </TwoGridContainer>
      </ContentContainer>
    </section>
  );
}

/*
    <section className="h-screen w-screen">
      <MasterHeader />
      <ContentContainer>
        <HeaderStep Items={schema.steps.map((item) => item.headerTitle)} CurrentIndexOfActiveItem={currentStep} />
        <TwoGridContainer>
          <ContainerStep className="space-y-6">
            <div className="mb-[4.8rem]">
              <TitleText className="font-normal text-title">{step?.inputTitle}</TitleText>
              <DefaultText className="mt-[1.2rem] text-subtitle">{step.inputSubtitle}</DefaultText>
            </div>
            {stepContent}
            <div className="flex justify-end pt-[6.2rem]">
              <ButtonStep variant="outline" shouldRender={showBack}>Back</ButtonStep>
              <ButtonStep shouldRender={shouldShowNext} disabled={submitState === "sending"} className="rounded-[0.1rem] px-[5.8rem] min-w-[4.4rem]">{isLast ? 'Request Quote':'Next'}</ButtonStep>
            </div>
          </ContainerStep>
          <aside className="w-full bg-transparent max-xl:py-[4.8rem] xl:w-[35.3rem] min-[1440px]:w-[39.3rem] max-lg:my-[4.8rem]">
            <AuxiliarySections step={step} />
          </aside>
        </TwoGridContainer>
      </ContentContainer>
    </section>
*/

/*
<div className="min-h-screen bg-white text-ink">
      <MasterHeader />

      <section className="w-full px-[5%] py-10">
        <header>
          <div className="flex flex-col gap-3 w-full">
            <Stepper steps={schema.steps.map((item) => item.headerTitle)} currentIndex={currentStep} />
            {step?.headerNote ? <p className="text-sm text-clay">{step.headerNote}</p> : null}
          </div>
        </header>
        <main className="flex justify-center w-full">
        <section className="xl:w-[144rem]">
          <div className="mt-10 flex flex-col gap-10 xl:flex-row xl:justify-between">
            <section className="w-full space-y-8 bg-transparent p-0 xl:max-w-[67.4rem] lg:w-100">
              <div>
                <TitleText className="font-normal">{step?.inputTitle}</TitleText>
                <DefaultText className="mt-3">{step.inputSubtitle}</DefaultText>
              </div>

              {isLoading ? <p className="text-sm text-clay">Loading form...</p> : null}
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
        </section>
      </main>
      </section>
    </div>
*/
