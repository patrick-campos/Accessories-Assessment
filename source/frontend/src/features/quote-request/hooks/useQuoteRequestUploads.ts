import * as React from "react";
import type { ItemDetails, PhotoSlot } from "../quoteRequestTypes";

export function useQuoteRequestUploads({
  apiOrigin,
  draftItem,
  setDraftItem,
  clearValidationErrors,
  setSubmitState,
  onDynamicPhotoRemoved,
}: {
  apiOrigin: string | null;
  draftItem: ItemDetails;
  setDraftItem: React.Dispatch<React.SetStateAction<ItemDetails>>;
  clearValidationErrors: () => void;
  setSubmitState: React.Dispatch<React.SetStateAction<"idle" | "sending" | "error" | "success">>;
  onDynamicPhotoRemoved?: (attributeId: string, fileId: string | null) => void;
}) {
  const uploadEndpoint = apiOrigin ? `${apiOrigin}/file` : null;
  const [uploadingCount, setUploadingCount] = React.useState(0);

  const startUpload = React.useCallback(() => setUploadingCount((prev) => prev + 1), []);
  const finishUpload = React.useCallback(() => setUploadingCount((prev) => Math.max(prev - 1, 0)), []);

  const deleteFile = React.useCallback(
    async (fileId: string | null) => {
      if (!fileId || !uploadEndpoint) return;
      try {
        await fetch(`${uploadEndpoint}/${fileId}`, { method: "DELETE" });
      } catch (error) {
        setSubmitState("error");
      }
    },
    [uploadEndpoint, setSubmitState]
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
    [clearValidationErrors, deleteFile, draftItem.photos, finishUpload, setDraftItem, setSubmitState, startUpload, uploadEndpoint]
  );

  const updateDynamicPhoto = React.useCallback(
    async (attributeId: string, file: File | null) => {
      clearValidationErrors();
      if (!file) {
        const previousFileId = draftItem.dynamicPhotos[attributeId]?.fileId ?? null;
        if (previousFileId) {
          await deleteFile(previousFileId);
        }
        if (onDynamicPhotoRemoved) {
          onDynamicPhotoRemoved(attributeId, previousFileId);
        }
        setDraftItem((prev) => {
          const existing = prev.dynamicPhotos[attributeId]?.previewUrl;
          if (existing) {
            URL.revokeObjectURL(existing);
          }
          return {
            ...prev,
            dynamicPhotos: {
              ...prev.dynamicPhotos,
              [attributeId]: { previewUrl: null, fileId: null },
            },
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
          const existing = prev.dynamicPhotos[attributeId]?.previewUrl;
          if (existing) {
            URL.revokeObjectURL(existing);
          }
          return {
            ...prev,
            dynamicPhotos: {
              ...prev.dynamicPhotos,
              [attributeId]: { previewUrl: url, fileId: data.fileId },
            },
          };
        });
      } catch (error) {
        setSubmitState("error");
      } finally {
        finishUpload();
      }
    },
    [
      clearValidationErrors,
      deleteFile,
      draftItem.dynamicPhotos,
      finishUpload,
      onDynamicPhotoRemoved,
      setDraftItem,
      setSubmitState,
      startUpload,
      uploadEndpoint,
    ]
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
    [clearValidationErrors, finishUpload, setDraftItem, setSubmitState, startUpload, uploadEndpoint]
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
    [clearValidationErrors, deleteFile, draftItem.additionalPhotos, setDraftItem]
  );

  return {
    uploadEndpoint,
    uploadingCount,
    updatePhoto,
    updateDynamicPhoto,
    addAdditionalPhoto,
    removeAdditionalPhoto,
  };
}
