import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { QuoteRequestView } from "./QuoteRequestView";
import { defaultSchema, type FormSchema } from "./schema";
import { submitInChunks } from "@/shared/lib/chunkedSubmit";

type PhotoSlot = "front" | "back" | "bottom" | "interior";

export type ItemDetails = {
  id: string;
  country: string;
  category: string;
  brand: string;
  model: string;
  size: string;
  condition: string;
  extras: string[];
  additionalInfo: string;
  photos: Record<PhotoSlot, string | null>;
  additionalPhotos: string[];
};

type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
};

const photoSlots: PhotoSlot[] = ["front", "back", "bottom", "interior"];

function createEmptyItem(country = ""): ItemDetails {
  return {
    id: `item-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    country,
    category: "",
    brand: "",
    model: "",
    size: "",
    condition: "",
    extras: [],
    additionalInfo: "",
    photos: {
      front: null,
      back: null,
      bottom: null,
      interior: null,
    },
    additionalPhotos: [],
  };
}

function normalizeSchema(data: FormSchema | null): FormSchema {
  if (!data || !data.steps?.length) {
    return defaultSchema;
  }
  return {
    steps: data.steps.length ? data.steps : defaultSchema.steps,
    options: {
      countries: data.options?.countries?.length ? data.options.countries : defaultSchema.options.countries,
      categories: data.options?.categories?.length ? data.options.categories : defaultSchema.options.categories,
      brands: data.options?.brands?.length ? data.options.brands : defaultSchema.options.brands,
      sizes: data.options?.sizes?.length ? data.options.sizes : defaultSchema.options.sizes,
      conditions: data.options?.conditions?.length ? data.options.conditions : defaultSchema.options.conditions,
      extras: data.options?.extras?.length ? data.options.extras : defaultSchema.options.extras,
    },
  };
}

function isDetailsComplete(item: ItemDetails) {
  return Boolean(item.country && item.category && item.brand && item.size && item.condition);
}

function arePhotosComplete(item: ItemDetails) {
  return photoSlots.every((slot) => Boolean(item.photos[slot]));
}

function isUserComplete(user: UserDetails) {
  return Boolean(user.firstName && user.lastName && user.email);
}

function upsertItem(items: ItemDetails[], nextItem: ItemDetails) {
  const index = items.findIndex((item) => item.id === nextItem.id);
  if (index < 0) {
    return [...items, nextItem];
  }
  const updated = [...items];
  updated[index] = nextItem;
  return updated;
}

export function QuoteRequestController() {
  const schemaUrl = process.env.NEXT_PUBLIC_FORM_SCHEMA_URL;
  const { data, isLoading, error } = useQuery({
    queryKey: ["form-schema", schemaUrl],
    queryFn: async () => {
      if (!schemaUrl) {
        return null;
      }
      const response = await fetch(schemaUrl);
      if (!response.ok) {
        throw new Error("Failed to load schema");
      }
      return (await response.json()) as FormSchema;
    },
    enabled: Boolean(schemaUrl),
  });

  const schema = React.useMemo(() => normalizeSchema(data ?? null), [data]);

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
  const [showErrors, setShowErrors] = React.useState(false);

  const clearValidationErrors = React.useCallback(() => setShowErrors(false), []);
  const showValidationErrors = React.useCallback(() => setShowErrors(true), []);

  const updateItem = React.useCallback(
    (partial: Partial<ItemDetails>) => {
      clearValidationErrors();
      setDraftItem((prev) => ({ ...prev, ...partial }));
    },
    [clearValidationErrors]
  );

  const updatePhoto = React.useCallback(
    (slot: PhotoSlot, file: File | null) => {
      clearValidationErrors();
      if (!file) {
        setDraftItem((prev) => ({ ...prev, photos: { ...prev.photos, [slot]: null } }));
        return;
      }
      const url = URL.createObjectURL(file);
      setDraftItem((prev) => {
        const existing = prev.photos[slot];
        if (existing) {
          URL.revokeObjectURL(existing);
        }
        return { ...prev, photos: { ...prev.photos, [slot]: url } };
      });
    },
    [clearValidationErrors]
  );

  const addAdditionalPhotos = React.useCallback(
    (files: FileList | null) => {
      clearValidationErrors();
      if (!files) return;
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setDraftItem((prev) => ({
        ...prev,
        additionalPhotos: [...prev.additionalPhotos, ...urls].slice(0, 16),
      }));
    },
    [clearValidationErrors]
  );

  const removeAdditionalPhoto = React.useCallback(
    (index: number) => {
      clearValidationErrors();
      setDraftItem((prev) => {
        const clone = [...prev.additionalPhotos];
        const removed = clone.splice(index, 1)[0];
        if (removed) {
          URL.revokeObjectURL(removed);
        }
        return { ...prev, additionalPhotos: clone };
      });
    },
    [clearValidationErrors]
  );

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

  const submitRequest = React.useCallback(async () => {
    const endpoint = process.env.NEXT_PUBLIC_REQUEST_QUOTE_URL;
    if (!endpoint) {
      setSubmitState("error");
      return;
    }
    setSubmitState("sending");
    try {
      await submitInChunks({
        items,
        chunkSize: 1,
        endpoint,
        checkpointKey: "request-quote-checkpoint",
        toPayload: (chunk, chunkIndex) => ({
          chunkIndex,
          totalChunks: Math.ceil(items.length / 1),
          user,
          items: chunk,
        }),
      });
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
    }
  }, [items, user]);

  const handleDetailsStep = React.useCallback(() => {
    if (!isDetailsComplete(draftItem)) {
      showValidationErrors();
      return;
    }
    clearValidationErrors();
    goToStep(1);
  }, [draftItem, clearValidationErrors, goToStep, showValidationErrors]);

  const handlePhotosStep = React.useCallback(() => {
    if (!arePhotosComplete(draftItem)) {
      showValidationErrors();
      return;
    }
    clearValidationErrors();
    setItems((prev) => upsertItem(prev, draftItem));
    goToStep(2);
  }, [draftItem, clearValidationErrors, goToStep, showValidationErrors]);

  const handleAdditionalStep = React.useCallback(() => {
    goToStep(3);
  }, [goToStep]);

  const handleReviewStep = React.useCallback(() => {
    if (!isUserComplete(user)) {
      showValidationErrors();
      return;
    }
    void submitRequest();
  }, [submitRequest, showValidationErrors, user]);

  const handleNext = React.useCallback(() => {
    const handlers = [handleDetailsStep, handlePhotosStep, handleAdditionalStep, handleReviewStep];
    const handler = handlers[currentStep];
    if (handler) {
      handler();
    }
  }, [currentStep, handleAdditionalStep, handleDetailsStep, handlePhotosStep, handleReviewStep]);

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

  return (
    <QuoteRequestView
      schema={schema}
      isLoading={isLoading}
      error={error ? "Falha ao carregar o formulario" : null}
      currentStep={currentStep}
      showErrors={showErrors}
      currentItem={draftItem}
      items={items}
      user={user}
      submitState={submitState}
      onUpdateItem={updateItem}
      onUpdatePhoto={updatePhoto}
      onAddAdditionalPhotos={addAdditionalPhotos}
      onRemoveAdditionalPhoto={removeAdditionalPhoto}
      onUpdateUser={updateUser}
      onNext={handleNext}
      onBack={handleBack}
      onAddAnother={handleAddAnotherItem}
      onEditItem={handleEditItem}
    />
  );
}
