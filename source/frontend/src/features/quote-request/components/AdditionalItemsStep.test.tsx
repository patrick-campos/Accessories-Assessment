import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ItemDetails } from "../types/quoteRequestTypes";
import { AdditionalItemsStep } from "./AdditionalItemsStep";

const item: ItemDetails = {
  id: "item-1",
  country: "US",
  category: "cat",
  brand: "brand",
  model: "Model A",
  additionalInfo: "",
  photos: {
    front: { previewUrl: "http://image", fileId: "file-1" },
    back: { previewUrl: null, fileId: null },
    bottom: { previewUrl: null, fileId: null },
    interior: { previewUrl: null, fileId: null },
  },
  dynamicAttributes: {},
  dynamicPhotos: {},
  additionalPhotos: [],
};

describe("AdditionalItemsStep", () => {
  it("renders item information and image", () => {
    render(
      <AdditionalItemsStep
        items={[item]}
        brandOptions={[{ value: "brand", label: "Brand A" }]}
        onAddAnother={() => undefined}
      />
    );

    expect(screen.getByText("Brand A")).toBeInTheDocument();
    expect(screen.getByText("Model A")).toBeInTheDocument();
    const image = document.querySelector('img[src="http://image"]');
    expect(image).toBeTruthy();
  });

  it("calls onAddAnother when button is clicked", async () => {
    const onAddAnother = jest.fn();
    const user = userEvent.setup();
    render(
      <AdditionalItemsStep
        items={[item]}
        brandOptions={[{ value: "brand", label: "Brand A" }]}
        onAddAnother={onAddAnother}
      />
    );

    await user.click(screen.getByText("Add more Items"));
    expect(onAddAnother).toHaveBeenCalled();
  });
});
