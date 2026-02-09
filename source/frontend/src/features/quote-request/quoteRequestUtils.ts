import type { FormSchema } from "./schema";
import type { ItemDetails, PhotoSlot, UserDetails } from "./quoteRequestTypes";
import { defaultSchema } from "./schema";

const photoSlots: PhotoSlot[] = ["front", "back", "bottom", "interior"];

function createEmptyPhotos() {
  return {
    front: { previewUrl: null, fileId: null },
    back: { previewUrl: null, fileId: null },
    bottom: { previewUrl: null, fileId: null },
    interior: { previewUrl: null, fileId: null },
  };
}

export function createEmptyItem(country = ""): ItemDetails {
  return {
    id: `item-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    country,
    category: "",
    brand: "",
    model: "",
    additionalInfo: "",
    photos: createEmptyPhotos(),
    dynamicAttributes: {},
    dynamicPhotos: {},
    additionalPhotos: [],
  };
}

export function normalizeSchema(data: FormSchema | null): FormSchema {
  if (!data || !data.steps?.length) {
    return {
      steps: defaultSchema.steps,
      options: {
        countries: [],
        categories: [],
        brands: [],
      },
    };
  }
  return {
    steps: data.steps.length ? data.steps : defaultSchema.steps,
    options: {
      countries: data.options?.countries ?? [],
      categories: data.options?.categories ?? [],
      brands: data.options?.brands ?? [],
    },
  };
}

export function isDetailsComplete(item: ItemDetails, requiredDynamicAttributeIds: string[]) {
  const baseComplete = Boolean(item.country && item.category && item.brand && item.model);
  const dynamicComplete = requiredDynamicAttributeIds.every((id) => (item.dynamicAttributes[id] ?? []).length > 0);
  return baseComplete && dynamicComplete;
}

export function arePhotosComplete(item: ItemDetails, requiredDynamicPhotoIds: string[]) {
  const baseComplete = photoSlots.every((slot) => Boolean(item.photos[slot].fileId));
  const dynamicComplete = requiredDynamicPhotoIds.every((id) => Boolean(item.dynamicPhotos[id]?.fileId));
  return baseComplete && dynamicComplete;
}

export function isUserComplete(user: UserDetails) {
  return Boolean(user.firstName && user.lastName && user.email);
}

export function upsertItem(items: ItemDetails[], nextItem: ItemDetails) {
  const index = items.findIndex((item) => item.id === nextItem.id);
  if (index < 0) {
    return [...items, nextItem];
  }
  const updated = [...items];
  updated[index] = nextItem;
  return updated;
}

export function getPhotoSlots() {
  return [...photoSlots];
}
