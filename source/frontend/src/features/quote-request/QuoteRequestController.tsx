import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { QuoteRequestView } from "./QuoteRequestView";
import { defaultSchema, type FormSchema } from "./schema";
import { RestClient } from "@/shared/api";
import { useRouter } from "next/router";

type PhotoSlot = "front" | "back" | "bottom" | "interior";
type UploadedPhoto = { previewUrl: string; fileId: string };
type UploadedPhotoSlot = { previewUrl: string | null; fileId: string | null };
type Option = { value: string; label: string };

type ListResponse<T> = { items: T[] };
type EntriesResponse<T> = { entries: T[] };

type CountryDto = { isoCode: string; name: string };
type CategoryDto = { id: string; name: string };
type BrandDto = { id: string; name: string };
type AttributeOptionDto = {
  id: string;
  name: string;
  key: string;
  displayOrder: number;
  outputLabel: string;
};
type AttributeDto = {
  id: string;
  name: string;
  key: string;
  displayOrder: number;
  type: string;
  options: AttributeOptionDto[];
  isRequired: boolean;
  businessModel: string;
};

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
  photos: Record<PhotoSlot, UploadedPhotoSlot>;
  additionalPhotos: UploadedPhoto[];
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
      front: { previewUrl: null, fileId: null },
      back: { previewUrl: null, fileId: null },
      bottom: { previewUrl: null, fileId: null },
      interior: { previewUrl: null, fileId: null },
    },
    additionalPhotos: [],
  };
}

function normalizeSchema(data: FormSchema | null): FormSchema {
  if (!data || !data.steps?.length) {
    return {
      steps: defaultSchema.steps,
      options: {
        countries: [],
        categories: [],
        brands: [],
        sizes: [],
        conditions: [],
        extras: [],
      },
    };
  }
  return {
    steps: data.steps.length ? data.steps : defaultSchema.steps,
    options: {
      countries: data.options?.countries ?? [],
      categories: data.options?.categories ?? [],
      brands: data.options?.brands ?? [],
      sizes: data.options?.sizes ?? [],
      conditions: data.options?.conditions ?? [],
      extras: data.options?.extras ?? [],
    },
  };
}

function isDetailsComplete(item: ItemDetails) {
  return Boolean(item.country && item.category && item.brand && item.model && item.size && item.condition);
}

function arePhotosComplete(item: ItemDetails) {
  return photoSlots.every((slot) => Boolean(item.photos[slot].fileId));
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
  const router = useRouter();
  const apiOrigin = React.useMemo(() => {
    const configuredOrigin = process.env.NEXT_PUBLIC_API_ORIGIN;
    if (configuredOrigin) {
      return configuredOrigin;
    }
    const fallbackEndpoint = process.env.NEXT_PUBLIC_REQUEST_QUOTE_URL;
    if (fallbackEndpoint) {
      return new URL(fallbackEndpoint).origin;
    }
    return null;
  }, []);
  const restClient = React.useMemo(() => (apiOrigin ? new RestClient(apiOrigin) : null), [apiOrigin]);
  const hasAvailableBuyer = true;
  const uploadEndpoint = apiOrigin ? `${apiOrigin}/file` : null;

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
  const [uploadingCount, setUploadingCount] = React.useState(0);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const clearValidationErrors = React.useCallback(() => setShowErrors(false), []);
  const showValidationErrors = React.useCallback(() => setShowErrors(true), []);
  const startUpload = React.useCallback(() => setUploadingCount((prev) => prev + 1), []);
  const finishUpload = React.useCallback(() => setUploadingCount((prev) => Math.max(prev - 1, 0)), []);
  const closeSuccessModal = React.useCallback(() => setShowSuccessModal(false), []);

  const deleteFile = React.useCallback(
    async (fileId: string | null) => {
      if (!fileId || !uploadEndpoint) return;
      try {
        await fetch(`${uploadEndpoint}/${fileId}`, { method: "DELETE" });
      } catch (error) {
        setSubmitState("error");
      }
    },
    [uploadEndpoint]
  );

  const countriesQuery = useQuery({
    queryKey: ["countries", apiOrigin],
    queryFn: async () => {
      if (!restClient) {
        return { items: [] } satisfies ListResponse<CountryDto>;
      }
      return restClient.get<ListResponse<CountryDto>>("/countries");
    },
    enabled: Boolean(restClient),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories", apiOrigin, draftItem.country, hasAvailableBuyer],
    queryFn: async () => {
      if (!restClient || !draftItem.country) {
        return { items: [] } satisfies ListResponse<CategoryDto>;
      }
      const params = new URLSearchParams({
        countryISOCode: draftItem.country,
        hasAvailableBuyer: String(hasAvailableBuyer),
      });
      return restClient.get<ListResponse<CategoryDto>>(`/categories?${params.toString()}`);
    },
    enabled: Boolean(restClient && draftItem.country),
  });

  const brandsQuery = useQuery({
    queryKey: ["brands", apiOrigin, draftItem.category, draftItem.country, hasAvailableBuyer],
    queryFn: async () => {
      if (!restClient || !draftItem.category || !draftItem.country) {
        return { entries: [] } satisfies EntriesResponse<BrandDto>;
      }
      const params = new URLSearchParams({
        categoryId: draftItem.category,
        countryIsoCode: draftItem.country,
        hasAvailableBuyer: String(hasAvailableBuyer),
      });
      return restClient.get<EntriesResponse<BrandDto>>(`/brands?${params.toString()}`);
    },
    enabled: Boolean(restClient && draftItem.category && draftItem.country),
  });

  const attributesQuery = useQuery({
    queryKey: ["attributes", apiOrigin, draftItem.category],
    queryFn: async () => {
      if (!restClient || !draftItem.category) {
        return { items: [] } satisfies ListResponse<AttributeDto>;
      }
      return restClient.get<ListResponse<AttributeDto>>(
        `/categories/${encodeURIComponent(draftItem.category)}/attributes`
      );
    },
    enabled: Boolean(restClient && draftItem.category),
  });

  const attributeOptions = React.useMemo(() => {
    const attributes = attributesQuery.data?.items ?? [];
    const findAttribute = (keys: string[]) => {
      const lowered = keys.map((key) => key.toLowerCase());
      return attributes.find((attribute) => {
        const haystack = `${attribute.key} ${attribute.name}`.toLowerCase();
        return lowered.some((key) => haystack.includes(key));
      });
    };
    const mapOptions = (attribute?: AttributeDto): Option[] => {
      if (!attribute) return [];
      return [...attribute.options]
        .sort((left, right) => left.displayOrder - right.displayOrder)
        .map((option) => ({
          value: option.id,
          label: option.outputLabel || option.name,
        }));
    };
    const size = findAttribute(["size"]);
    const condition = findAttribute(["condition", "state"]);
    const extras = findAttribute(["extra", "accessor", "extra"]);

    return {
      size,
      condition,
      extras,
      sizeOptions: mapOptions(size),
      conditionOptions: mapOptions(condition),
      extrasOptions: mapOptions(extras),
      optionLookup: attributes.reduce((map, attribute) => {
        attribute.options.forEach((option) => {
          map.set(option.id, option);
        });
        return map;
      }, new Map<string, AttributeOptionDto>()),
    };
  }, [attributesQuery.data?.items]);

  const schema = React.useMemo(() => {
    const countries =
      countriesQuery.data?.items.map((country) => ({
        value: country.isoCode,
        label: country.name,
      })) ?? [];
    const categories =
      categoriesQuery.data?.items.map((category) => ({
        value: category.id,
        label: category.name,
      })) ?? [];
    const brands =
      brandsQuery.data?.entries.map((brand) => ({
        value: brand.id,
        label: brand.name,
      })) ?? [];

    return normalizeSchema({
      steps: defaultSchema.steps,
      options: {
        countries,
        categories,
        brands,
        sizes: attributeOptions.sizeOptions,
        conditions: attributeOptions.conditionOptions,
        extras: attributeOptions.extrasOptions,
      },
    });
  }, [
    attributeOptions.conditionOptions,
    attributeOptions.extrasOptions,
    attributeOptions.sizeOptions,
    brandsQuery.data?.entries,
    categoriesQuery.data?.items,
    countriesQuery.data?.items,
  ]);

  const isLoading =
    countriesQuery.isLoading ||
    categoriesQuery.isLoading ||
    brandsQuery.isLoading ||
    attributesQuery.isLoading;
  const error =
    countriesQuery.error ?? categoriesQuery.error ?? brandsQuery.error ?? attributesQuery.error;

  const updateItem = React.useCallback(
    (partial: Partial<ItemDetails>) => {
      clearValidationErrors();
      setDraftItem((prev) => {
        const next = { ...prev, ...partial };
        if (partial.country && partial.country !== prev.country) {
          next.category = "";
          next.brand = "";
          next.size = "";
          next.condition = "";
          next.extras = [];
        }
        if (partial.category && partial.category !== prev.category) {
          next.brand = "";
          next.size = "";
          next.condition = "";
          next.extras = [];
        }
        return next;
      });
    },
    [clearValidationErrors]
  );

  const updatePhoto = React.useCallback(
    async (slot: PhotoSlot, file: File | null) => {
      clearValidationErrors();
      if (!file) {
        const previousFileId = draftItem.photos[slot]?.fileId ?? null;
        if (previousFileId) {
          await deleteFile(previousFileId);
        }
        setDraftItem((prev) => {
          const existing = prev.photos[slot]?.previewUrl;
          if (existing) {
            URL.revokeObjectURL(existing);
          }
          return {
            ...prev,
            photos: { ...prev.photos, [slot]: { previewUrl: null, fileId: null } },
          };
        });
        return;
      }
      if (!uploadEndpoint) {
        return;
      }
      try {
        startUpload();
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        const data = (await response.json()) as { fileId: string };
        const url = URL.createObjectURL(file);
        setDraftItem((prev) => {
          const existing = prev.photos[slot]?.previewUrl;
          if (existing) {
            URL.revokeObjectURL(existing);
          }
          return {
            ...prev,
            photos: { ...prev.photos, [slot]: { previewUrl: url, fileId: data.fileId } },
          };
        });
      } catch (error) {
        setSubmitState("error");
      } finally {
        finishUpload();
      }
    },
    [clearValidationErrors, deleteFile, draftItem.photos, finishUpload, startUpload, uploadEndpoint]
  );

  const addAdditionalPhoto = React.useCallback(
    async (file: File | null) => {
      clearValidationErrors();
      if (!file || !uploadEndpoint) return;
      try {
        startUpload();
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        const data = (await response.json()) as { fileId: string };
        const url = URL.createObjectURL(file);
        setDraftItem((prev) => ({
          ...prev,
          additionalPhotos: [...prev.additionalPhotos, { previewUrl: url, fileId: data.fileId }].slice(
            0,
            16
          ),
        }));
      } catch (error) {
        setSubmitState("error");
      } finally {
        finishUpload();
      }
    },
    [clearValidationErrors, finishUpload, startUpload, uploadEndpoint]
  );

  const removeAdditionalPhoto = React.useCallback(
    (index: number) => {
      clearValidationErrors();
      const removed = draftItem.additionalPhotos[index];
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      void deleteFile(removed?.fileId ?? null);
      setDraftItem((prev) => {
        const clone = [...prev.additionalPhotos];
        clone.splice(index, 1);
        return { ...prev, additionalPhotos: clone };
      });
    },
    [clearValidationErrors, deleteFile, draftItem.additionalPhotos]
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
    const endpoint = process.env.NEXT_PUBLIC_REQUEST_QUOTE_URL ?? (apiOrigin ? `${apiOrigin}/quote` : null);
    if (!endpoint) {
      setSubmitState("error");
      return;
    }
    setSubmitState("sending");
    try {
      const endpointUrl = new URL(endpoint);
      const requestOrigin = endpointUrl.origin;
      const requestPath = endpointUrl.pathname + endpointUrl.search;
      const client = new RestClient(requestOrigin);

      const countryOfOrigin = items[0]?.country ?? draftItem.country;
      if (!countryOfOrigin) {
        setSubmitState("error");
        return;
      }

      const optionLabel = (id: string) =>
        attributeOptions.optionLookup.get(id)?.outputLabel ??
        attributeOptions.optionLookup.get(id)?.name ??
        id;

      const buildAttributes = (item: ItemDetails) => {
        const attributes = [];
        if (attributeOptions.size && item.size) {
          attributes.push({
            id: attributeOptions.size.id,
            values: [{ id: item.size, label: optionLabel(item.size) }],
          });
        }
        if (attributeOptions.condition && item.condition) {
          attributes.push({
            id: attributeOptions.condition.id,
            values: [{ id: item.condition, label: optionLabel(item.condition) }],
          });
        }
        if (attributeOptions.extras && item.extras.length) {
          attributes.push({
            id: attributeOptions.extras.id,
            values: item.extras.map((extra) => ({ id: extra, label: optionLabel(extra) })),
          });
        }
        return attributes;
      };

      const filePayload = (fileId: string, subtype: string) => ({
        type: "Photos",
        provider: "FileAPI",
        externalId: fileId,
        location: "",
        metadata: {
          PhotoType: "None",
          PhotoSubtype: subtype,
          Description: "",
        },
      });

      const slotSubtypes: Record<PhotoSlot, string> = {
        front: "Front",
        back: "Back",
        bottom: "Bottom",
        interior: "Inside",
      };

      await client.post(requestPath, {
        countryOfOrigin,
        customerInformation: {
          externalSellerTier: null,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        items: items.map((item) => ({
          attributes: buildAttributes(item),
          categoryId: item.category,
          brandId: item.brand,
          model: item.model,
          description: item.additionalInfo,
          files: [
            ...photoSlots
              .map((slot) => {
                const fileId = item.photos[slot].fileId;
                if (!fileId) return null;
                return filePayload(fileId, slotSubtypes[slot]);
              })
              .filter((entry): entry is ReturnType<typeof filePayload> => Boolean(entry)),
            ...item.additionalPhotos.map((photo) => filePayload(photo.fileId, "Additional")),
          ],
        })),
      });
      setSubmitState("success");
      setShowSuccessModal(true);
    } catch (error) {
      setSubmitState("error");
    }
  }, [apiOrigin, attributeOptions.condition, attributeOptions.extras, attributeOptions.optionLookup, attributeOptions.size, draftItem.country, items, user]);

  const handleNext = React.useCallback(() => {
    if (currentStep === 0) {
      if (!isDetailsComplete(draftItem)) {
        showValidationErrors();
        return;
      }
      clearValidationErrors();
      goToStep(1);
      return;
    }
    if (currentStep === 1) {
      if (!arePhotosComplete(draftItem)) {
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
  }, [clearValidationErrors, currentStep, draftItem, goToStep, showValidationErrors, submitRequest, user]);

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
      error={error ? "Falha ao carregar o formulario" : null}
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
      onAddAdditionalPhoto={addAdditionalPhoto}
      onRemoveAdditionalPhoto={removeAdditionalPhoto}
      onUpdateUser={updateUser}
      onNext={handleNext}
      onBack={handleBack}
      onAddAnother={handleAddAnotherItem}
      onEditItem={handleEditItem}
      onEditPhotos={handleEditItemPhotos}
      onCloseSuccessModal={closeSuccessModal}
      onRequestAnotherQuote={handleRequestAnotherQuote}
      onMyQuotes={handleMyQuotes}
    />
  );
}
