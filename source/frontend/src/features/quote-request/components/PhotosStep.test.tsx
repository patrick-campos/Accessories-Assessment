import { render, screen } from "@testing-library/react";
import type { DynamicQuestion, ItemDetails } from "../types/quoteRequestTypes";
import { PhotosStep } from "./PhotosStep";

const baseItem: ItemDetails = {
  id: "item-1",
  country: "US",
  category: "cat",
  brand: "brand",
  model: "model",
  additionalInfo: "",
  photos: {
    front: { previewUrl: null, fileId: null },
    back: { previewUrl: null, fileId: null },
    bottom: { previewUrl: null, fileId: null },
    interior: { previewUrl: null, fileId: null },
  },
  dynamicAttributes: {},
  dynamicPhotos: {},
  additionalPhotos: [],
};

const photoQuestion: DynamicQuestion = {
  id: "photo-1",
  name: "Serial tag",
  key: "quote-creation:item-photos.attributes.serial.title",
  stage: "item-photos",
  field: "serial",
  type: "Photo",
  isRequired: true,
  displayOrder: 1,
  options: [],
};

describe("PhotosStep", () => {
  it("renders fixed and dynamic photo sections", () => {
    render(
      <PhotosStep
        item={baseItem}
        showErrors={false}
        onUpdatePhoto={() => undefined}
        onUpdateDynamicPhoto={() => undefined}
        dynamicAttributes={[photoQuestion]}
        onAddAdditionalPhoto={() => undefined}
        onRemoveAdditionalPhoto={() => undefined}
      />
    );

    expect(screen.getByText("Photos of your item")).toBeInTheDocument();
    expect(screen.getByText("Additional photos")).toBeInTheDocument();
    expect(screen.getByText("Serial tag")).toBeInTheDocument();
  });

  it("shows required hint for missing dynamic photo when showErrors is true", () => {
    render(
      <PhotosStep
        item={baseItem}
        showErrors
        onUpdatePhoto={() => undefined}
        onUpdateDynamicPhoto={() => undefined}
        dynamicAttributes={[photoQuestion]}
        onAddAdditionalPhoto={() => undefined}
        onRemoveAdditionalPhoto={() => undefined}
      />
    );

    expect(screen.getAllByText("Required").length).toBeGreaterThan(0);
  });
});
