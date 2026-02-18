import * as React from "react";
import { QuoteRequestView } from "./QuoteRequestView";
import { useRouter } from "next/router";
import type { ItemDetails, UserDetails } from "./types/quoteRequestTypes";
import { arePhotosComplete, createEmptyItem, isDetailsComplete, isUserComplete, upsertItem } from "./hooks/quoteRequestUtils";
import { useQuoteRequestQueries } from "./hooks/useQuoteRequestQueries";
import { useQuoteRequestUploads } from "./hooks/useQuoteRequestUploads";
import { useQuoteRequestSubmit } from "./hooks/useQuoteRequestSubmit";

export function QuoteRequestController() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [items, setItems] = React.useState<ItemDetails[]>([]);
  const [draftItem, setDraftItem] = React.useState<ItemDetails>(() => createEmptyItem());
  const [user, setUser] = React.useState<UserDetails>({
    firstName: "Alicia",
    lastName: "Morris",
    email: "alicia@example.com",
  });
  const [submitState, setSubmitState] = React.useState<"idle" | "sending" | "error" | "success">(
    "idle"
  );
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [showErrors, setShowErrors] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const clearValidationErrors = React.useCallback(() => setShowErrors(false), []);
  const showValidationErrors = React.useCallback(() => setShowErrors(true), []);
  const closeSuccessModal = React.useCallback(() => setShowSuccessModal(false), []);
  const clearApiError = React.useCallback(() => setApiError(null), []);

  const { apiOrigin, schema, detailAttributes, photoAttributes, isLoading, error } =
    useQuoteRequestQueries(draftItem);
  const uploads = useQuoteRequestUploads({
    apiOrigin,
    draftItem,
    setDraftItem,
    clearValidationErrors,
    setSubmitState,
  });
  const { submitRequest } = useQuoteRequestSubmit({
    apiOrigin,
    detailAttributes,
    photoAttributes,
    items,
    draftItem,
    user,
    setSubmitState,
    setShowSuccessModal,
    setErrorMessage: setApiError,
  });

  const updateItem = React.useCallback(
    (partial: Partial<ItemDetails>) => {
      clearValidationErrors();
      setDraftItem((prev) => {
        const next = { ...prev, ...partial };
        if (partial.country && partial.country !== prev.country) {
          next.category = "";
          next.brand = "";
          next.dynamicAttributes = {};
          next.dynamicPhotos = {};
        }
        if (partial.category && partial.category !== prev.category) {
          next.brand = "";
          next.dynamicAttributes = {};
          next.dynamicPhotos = {};
        }
        return next;
      });
    },
    [clearValidationErrors]
  );

  const updatePhoto = uploads.updatePhoto;
  const updateDynamicPhoto = uploads.updateDynamicPhoto;
  const addAdditionalPhoto = uploads.addAdditionalPhoto;
  const removeAdditionalPhoto = uploads.removeAdditionalPhoto;

  const updateUser = React.useCallback(
    (nextUser: UserDetails) => {
      clearValidationErrors();
      setUser(nextUser);
    },
    [clearValidationErrors]
  );

  const goToStep = React.useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
  }, []);

  const uploadingCount = uploads.uploadingCount;
  const requiredDynamicPhotos = React.useMemo(
    () => photoAttributes.filter((attribute) => attribute.isRequired).map((attribute) => attribute.id),
    [photoAttributes]
  );
  const requiredDynamicDetails = React.useMemo(
    () => detailAttributes.filter((attribute) => attribute.isRequired).map((attribute) => attribute.id),
    [detailAttributes]
  );

  const handleNext = React.useCallback(() => {
    if (currentStep === 0) {
      if (!isDetailsComplete(draftItem, requiredDynamicDetails)) {
        showValidationErrors();
        return;
      }
      clearValidationErrors();
      goToStep(1);
      return;
    }
    if (currentStep === 1) {
      if (!arePhotosComplete(draftItem, requiredDynamicPhotos)) {
        showValidationErrors();
        return;
      }
      clearValidationErrors();
      setItems((prev) => upsertItem(prev, draftItem));
      goToStep(2);
      return;
    }
    if (currentStep === 2) {
      goToStep(3);
      return;
    }
    if (currentStep === 3) {
      if (!isUserComplete(user)) {
        showValidationErrors();
        return;
      }
      void submitRequest();
    }
  }, [
    clearValidationErrors,
    currentStep,
    draftItem,
    goToStep,
    requiredDynamicDetails,
    requiredDynamicPhotos,
    showValidationErrors,
    submitRequest,
    user,
  ]);

  const handleBack = React.useCallback(() => {
    clearValidationErrors();
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, [clearValidationErrors]);

  const handleAddAnotherItem = React.useCallback(() => {
    setItems((prev) => upsertItem(prev, draftItem));
    setDraftItem(createEmptyItem(draftItem.country));
    goToStep(0);
  }, [draftItem, goToStep]);

  const handleEditItem = React.useCallback(
    (id: string) => {
      const selectedItem = items.find((entry) => entry.id === id);
      if (!selectedItem) return;
      setDraftItem(selectedItem);
      goToStep(0);
    },
    [items, goToStep]
  );

  const updateDynamicAttribute = React.useCallback(
    (attributeId: string, values: string[]) => {
      clearValidationErrors();
      setDraftItem((prev) => ({
        ...prev,
        dynamicAttributes: {
          ...prev.dynamicAttributes,
          [attributeId]: values,
        },
      }));
    },
    [clearValidationErrors]
  );

  const handleEditItemPhotos = React.useCallback(
    (id: string) => {
      const selectedItem = items.find((entry) => entry.id === id);
      if (!selectedItem) return;
      setDraftItem(selectedItem);
      goToStep(1);
    },
    [items, goToStep]
  );

  const handleRequestAnotherQuote = React.useCallback(() => {
    setItems([]);
    setDraftItem(createEmptyItem());
    setCurrentStep(0);
    setSubmitState("idle");
    setShowSuccessModal(false);
  }, []);

  const handleMyQuotes = React.useCallback(() => {
    setShowSuccessModal(false);
    void router.push("/quotelist");
  }, [router]);

  return (
    <QuoteRequestView
      schema={schema}
      isLoading={isLoading}
      error={apiError ?? (error ? "Falha ao carregar o formulario" : null)}
      currentStep={currentStep}
      showErrors={showErrors}
      currentItem={draftItem}
      items={items}
      user={user}
      submitState={submitState}
      isUploading={uploadingCount > 0}
      showSuccessModal={showSuccessModal}
      onUpdateItem={updateItem}
      onUpdatePhoto={updatePhoto}
      onUpdateDynamicPhoto={updateDynamicPhoto}
      detailAttributes={detailAttributes}
      photoAttributes={photoAttributes}
      onUpdateDynamicAttribute={updateDynamicAttribute}
      onAddAdditionalPhoto={addAdditionalPhoto}
      onRemoveAdditionalPhoto={removeAdditionalPhoto}
      onUpdateUser={updateUser}
      onNext={handleNext}
      onBack={handleBack}
      onAddAnother={handleAddAnotherItem}
      onEditItem={handleEditItem}
      onEditPhotos={handleEditItemPhotos}
      onCloseSuccessModal={closeSuccessModal}
      onClearError={clearApiError}
      onRequestAnotherQuote={handleRequestAnotherQuote}
      onMyQuotes={handleMyQuotes}
    />
  );
}

