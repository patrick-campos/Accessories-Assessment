import * as React from "react";
import { RestClient } from "@/shared/api";
import type { DynamicQuestion, ItemDetails, PhotoSlot, UserDetails } from "../types/quoteRequestTypes";
import { getPhotoSlots, mapDynamicAttributes } from "./quoteRequestUtils";

export function useQuoteRequestSubmit({
  apiOrigin,
  detailAttributes,
  photoAttributes,
  items,
  draftItem,
  user,
  setSubmitState,
  setShowSuccessModal,
  setErrorMessage,
}: {
  apiOrigin: string | null;
  detailAttributes: DynamicQuestion[];
  photoAttributes: DynamicQuestion[];
  items: ItemDetails[];
  draftItem: ItemDetails;
  user: UserDetails;
  setSubmitState: React.Dispatch<React.SetStateAction<"idle" | "sending" | "error" | "success">>;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const photoSlots = React.useMemo(() => getPhotoSlots(), []);

  const submitRequest = React.useCallback(async () => {
    const endpoint = process.env.NEXT_PUBLIC_REQUEST_QUOTE_URL ?? (apiOrigin ? `${apiOrigin}/quote` : null);
    if (!endpoint) {
      setSubmitState("error");
      return;
    }
    setSubmitState("sending");
    setErrorMessage(null);
    try {
      const endpointUrl = new URL(endpoint);
      const requestUrl = endpointUrl.toString();

      const countryOfOrigin = items[0]?.country ?? draftItem.country;
      if (!countryOfOrigin) {
        setSubmitState("error");
        return;
      }

      const buildAttributes = (item: ItemDetails) =>
        mapDynamicAttributes(detailAttributes, item.dynamicAttributes).map(({ id, values }) => ({
          id,
          values,
        }));

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

      const buildFixedPhotoFiles = (item: ItemDetails) =>
        photoSlots
          .map((slot) => {
            const fileId = item.photos[slot].fileId;
            if (!fileId) return null;
            return filePayload(fileId, slotSubtypes[slot]);
          })
          .filter((entry): entry is ReturnType<typeof filePayload> => Boolean(entry));

      const buildDynamicPhotoFiles = (item: ItemDetails) =>
        photoAttributes
          .map((attribute) => {
            const fileId = item.dynamicPhotos[attribute.id]?.fileId;
            if (!fileId) return null;
            return filePayload(fileId, attribute.name || attribute.field || "Additional");
          })
          .filter((entry): entry is ReturnType<typeof filePayload> => Boolean(entry));

      const buildAdditionalPhotoFiles = (item: ItemDetails) =>
        item.additionalPhotos.map((photo) => filePayload(photo.fileId, "Additional"));

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
              ...buildFixedPhotoFiles(item),
              ...buildDynamicPhotoFiles(item),
              ...buildAdditionalPhotoFiles(item),
            ],
          })),
        }),
      });
      if (!response.ok) {
        let message = `Request failed: ${response.status}`;
        try {
          const data = await response.json();
          if (data && typeof data === "object") {
            message = data.detail || data.message || data.title || message;
          }
        } catch {
          // ignore json parse errors
        }
        throw new Error(message);
      }
      setSubmitState("success");
      setShowSuccessModal(true);
    } catch (error) {
      setSubmitState("error");
      const message = error instanceof Error ? error.message : "Unexpected error";
      setErrorMessage(message);
    }
  }, [
    apiOrigin,
    draftItem.country,
    items,
    photoSlots,
    detailAttributes,
    photoAttributes,
    setErrorMessage,
    setShowSuccessModal,
    setSubmitState,
    user.email,
    user.firstName,
    user.lastName,
  ]);

  return { submitRequest };
}
