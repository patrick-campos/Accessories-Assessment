import type { DynamicQuestion, ItemDetails } from "./types/quoteRequestTypes";
import type { FormSchema } from "./schema";
import { MasterHeader } from "@/shared/ui";
import { AuxiliarySections } from "./components/AuxiliarySections";
import { buildQuoteRequestStepViews } from "./components/QuoteRequestStepViews";
import { TitleText } from "@/shared/ui/Title";
import { DefaultText } from "@/shared/ui/DefaultText";
import { ContentContainer } from "@/shared/ui/ContentContainer";
import { HeaderStep } from "./components/HeaderStep";
import { TwoGridContainer } from "@/shared/ui/TwoGridContainer";
import { ContainerStep } from "./components/ContainerStep";
import { ButtonStep } from "./components/ButtonsStep";
import { QuoteSuccessModal } from "./components/QuoteSuccessModal";
import { ApiErrorModal } from "@/shared/ui/ApiErrorModal";
import { Footer } from "@/shared/ui/footer";

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
  detailAttributes: DynamicQuestion[];
  photoAttributes: DynamicQuestion[];
  onUpdateItem: (partial: Partial<ItemDetails>) => void;
  onUpdatePhoto: (slot: "front" | "back" | "bottom" | "interior", file: File | null) => void;
  onUpdateDynamicPhoto: (attributeId: string, file: File | null) => void;
  onUpdateDynamicAttribute: (attributeId: string, values: string[]) => void;
  onAddAdditionalPhoto: (file: File | null) => void;
  onRemoveAdditionalPhoto: (index: number) => void;
  onUpdateUser: (user: { firstName: string; lastName: string; email: string }) => void;
  onNext: () => void;
  onBack: () => void;
  onAddAnother: () => void;
  onEditItem: (id: string) => void;
  onEditPhotos: (id: string) => void;
  onCloseSuccessModal: () => void;
  onClearError: () => void;
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
  detailAttributes,
  photoAttributes,
  onUpdateItem,
  onUpdatePhoto,
  onUpdateDynamicPhoto,
  onUpdateDynamicAttribute,
  onAddAdditionalPhoto,
  onRemoveAdditionalPhoto,
  onUpdateUser,
  onNext,
  onBack,
  onAddAnother,
  onEditItem,
  onEditPhotos,
  onCloseSuccessModal,
  onClearError,
  onRequestAnotherQuote,
  onMyQuotes,
}: Props) {
  const step = schema.steps[currentStep];
  const showBack = currentStep > 0;
  const isLast = currentStep === schema.steps.length - 1;
  const shouldShowNext = currentStep !== 0 || Boolean(currentItem.category);
  const successModal = (
    <QuoteSuccessModal
      isOpen={showSuccessModal}
      onClose={onCloseSuccessModal}
      onRequestAnother={onRequestAnotherQuote}
      onMyQuotes={onMyQuotes}
    />
  );
  const errorModal = <ApiErrorModal message={error} onClose={onClearError} />;

  const stepViews = buildQuoteRequestStepViews({
    schema,
    currentItem,
    items,
    user,
    showErrors,
    detailAttributes,
    photoAttributes,
    onUpdateItem,
    onUpdatePhoto,
    onUpdateDynamicPhoto,
    onUpdateDynamicAttribute,
    onAddAdditionalPhoto,
    onRemoveAdditionalPhoto,
    submitState,
    onUpdateUser,
    onAddAnother,
    onEditItem,
    onEditPhotos,
  });

  const stepContent = stepViews[currentStep] ?? stepViews[0];

  return (
    <section className="min-h-screen w-screen flex flex-col">
      <MasterHeader />
      {errorModal}
      {successModal}
      <ContentContainer className="xl:min-h-[80.4vh]">
        <HeaderStep Items={schema.steps.map((item) => item.headerTitle)} CurrentIndexOfActiveItem={currentStep} />
        <TwoGridContainer className="w-full 2xl:w-[144rem] max-xl:m-auto">
          <ContainerStep className="space-y-6 lg:w-[60%] xl:[w-50%]">
            <div className="mb-lg">
              <TitleText className="font-normal text-title">{step?.inputTitle}</TitleText>
              <DefaultText className="mt-[1.2rem] text-subtitle">{step.inputSubtitle}</DefaultText>
            </div>
            {stepContent}
            <div className="flex justify-end pt-[6.2rem] max-sm:grid-cols-2 max-sm:flex-col max-sm:gap-8 max-sm:justify-center max-sm:pt-[2rem]">
              <ButtonStep variant="outline" shouldRender={showBack} onClick={onBack} className="rounded-round px-[5.8rem] min-w-[4.4rem] mr-[2rem] mb-0.8rem max-sm:w-full max-sm:mr-0">Back</ButtonStep>
              <ButtonStep shouldRender={shouldShowNext} onClick={onNext} disabled={submitState === "sending" || isUploading} className="rounded-round px-[5.8rem] min-w-[4.4rem] max-sm:w-full">{isLast ? "Request Quote" : "Next"}</ButtonStep>
            </div>
          </ContainerStep>
          <aside className="w-full bg-transparent max-xl:py-lg lg:w-[35.3rem] min-[1440px]:w-[39.3rem] max-lg:my-lg">
            <AuxiliarySections step={step} />
          </aside>
        </TwoGridContainer>
      </ContentContainer>
      <Footer />
    </section>
  );
}

