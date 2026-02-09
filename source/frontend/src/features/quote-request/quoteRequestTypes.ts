export type PhotoSlot = "front" | "back" | "bottom" | "interior";
export type UploadedPhoto = { previewUrl: string; fileId: string };
export type UploadedPhotoSlot = { previewUrl: string | null; fileId: string | null };

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
