export type PhotoSlot = "front" | "back" | "bottom" | "interior";
export type UploadedPhoto = { previewUrl: string; fileId: string };
export type UploadedPhotoSlot = { previewUrl: string | null; fileId: string | null };

export type DynamicQuestion = {
  id: string;
  name: string;
  key: string;
  stage: "item-details" | "item-photos" | "unknown";
  field: string;
  type: string;
  isRequired: boolean;
  displayOrder: number;
  options: Array<{ id: string; label: string }>;
};

export type ItemDetails = {
  id: string;
  country: string;
  category: string;
  brand: string;
  model: string;
  additionalInfo: string;
  photos: Record<PhotoSlot, UploadedPhotoSlot>;
  dynamicAttributes: Record<string, string[]>;
  dynamicPhotos: Record<string, UploadedPhotoSlot>;
  additionalPhotos: UploadedPhoto[];
};

export type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
};
