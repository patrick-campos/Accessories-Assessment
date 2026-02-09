import * as React from "react";
import type { ItemDetails, PhotoSlot } from "../types/quoteRequestTypes";

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

  const revokePreview = React.useCallback((previewUrl?: string | null) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, []);

  const uploadFile = React.useCallback(
    async (file: File) => {
      if (!uploadEndpoint) {
        return null;
      }
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
      return { fileId: data.fileId, previewUrl: URL.createObjectURL(file) };
    },
    [uploadEndpoint]
  );

  const withUpload = React.useCallback(
    async <T,>(operation: () => Promise<T>) => {
      try {
        startUpload();
        return await operation();
      } catch (error) {
        setSubmitState("error");
        return null;
      } finally {
        finishUpload();
      }
    },
    [finishUpload, setSubmitState, startUpload]
  );

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
          revokePreview(prev.photos[slot]?.previewUrl);
          return {
            ...prev,
            photos: { ...prev.photos, [slot]: { previewUrl: null, fileId: null } },
          };
        });
        return;
      }

      const uploaded = await withUpload(() => uploadFile(file));
      if (!uploaded) return;
      setDraftItem((prev) => {
        revokePreview(prev.photos[slot]?.previewUrl);
        return {
          ...prev,
          photos: { ...prev.photos, [slot]: { previewUrl: uploaded.previewUrl, fileId: uploaded.fileId } },
        };
      });
    },
    [clearValidationErrors, deleteFile, draftItem.photos, revokePreview, setDraftItem, uploadFile, withUpload]
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
          revokePreview(prev.dynamicPhotos[attributeId]?.previewUrl);
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

      const uploaded = await withUpload(() => uploadFile(file));
      if (!uploaded) return;
      setDraftItem((prev) => {
        revokePreview(prev.dynamicPhotos[attributeId]?.previewUrl);
        return {
          ...prev,
          dynamicPhotos: {
            ...prev.dynamicPhotos,
            [attributeId]: { previewUrl: uploaded.previewUrl, fileId: uploaded.fileId },
          },
        };
      });
    },
    [
      clearValidationErrors,
      deleteFile,
      draftItem.dynamicPhotos,
      onDynamicPhotoRemoved,
      revokePreview,
      setDraftItem,
      uploadFile,
      withUpload,
    ]
  );

  const addAdditionalPhoto = React.useCallback(
    async (file: File | null) => {
      clearValidationErrors();
      if (!file) return;
      const uploaded = await withUpload(() => uploadFile(file));
      if (!uploaded) return;
      setDraftItem((prev) => ({
        ...prev,
        additionalPhotos: [...prev.additionalPhotos, uploaded].slice(0, 16),
      }));
    },
    [clearValidationErrors, setDraftItem, uploadFile, withUpload]
  );

  const removeAdditionalPhoto = React.useCallback(
    (index: number) => {
      clearValidationErrors();
      const removed = draftItem.additionalPhotos[index];
      revokePreview(removed?.previewUrl);
      void deleteFile(removed?.fileId ?? null);
      setDraftItem((prev) => {
        const clone = [...prev.additionalPhotos];
        clone.splice(index, 1);
        return { ...prev, additionalPhotos: clone };
      });
    },
    [clearValidationErrors, deleteFile, draftItem.additionalPhotos, revokePreview, setDraftItem]
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
