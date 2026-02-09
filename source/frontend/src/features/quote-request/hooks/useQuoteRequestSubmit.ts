import * as React from "react";
import { RestClient } from "@/shared/api";
import type { DynamicQuestion, ItemDetails, PhotoSlot, UserDetails } from "../quoteRequestTypes";
import { getPhotoSlots } from "../quoteRequestUtils";

export function useQuoteRequestSubmit({
  apiOrigin,
  detailAttributes,
  photoAttributes,
  items,
  draftItem,
  user,
  setSubmitState,
  setShowSuccessModal,
}: {
  apiOrigin: string | null;
  detailAttributes: DynamicQuestion[];
  photoAttributes: DynamicQuestion[];
  items: ItemDetails[];
  draftItem: ItemDetails;
  user: UserDetails;
  setSubmitState: React.Dispatch<React.SetStateAction<"idle" | "sending" | "error" | "success">>;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const photoSlots = React.useMemo(() => getPhotoSlots(), []);

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

      const buildAttributes = (item: ItemDetails) => {
        const attributes: Array<{ id: string; values: Array<{ id: string; label: string }> }> = [];
        detailAttributes.forEach((attribute) => {
          const values = item.dynamicAttributes[attribute.id] ?? [];
          if (values.length === 0) {
            return;
          }
          const optionLookup = attribute.options.reduce((map, option) => {
            map.set(option.id, option.label);
            return map;
          }, new Map<string, string>());

          attributes.push({
            id: attribute.id,
            values: values.map((value) => ({
              id: `${attribute.id}:${value}`,
              label: optionLookup.get(value) ?? value,
            })),
          });
        });
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
            ...photoAttributes
              .map((attribute) => {
                const fileId = item.dynamicPhotos[attribute.id]?.fileId;
                if (!fileId) return null;
                return filePayload(fileId, attribute.name || attribute.field || "Additional");
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
  }, [
    apiOrigin,
    draftItem.country,
    items,
    photoSlots,
    detailAttributes,
    photoAttributes,
    setShowSuccessModal,
    setSubmitState,
    user.email,
    user.firstName,
    user.lastName,
  ]);

  return { submitRequest };
}
