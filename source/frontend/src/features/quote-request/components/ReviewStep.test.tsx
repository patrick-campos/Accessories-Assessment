import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { DynamicQuestion, ItemDetails } from "../types/quoteRequestTypes";
import type { FormSchema } from "../schema";
import { ReviewStep } from "./ReviewStep";

const schema: FormSchema = {
  steps: [],
  options: {
    countries: [],
    categories: [{ value: "cat", label: "Bags" }],
    brands: [{ value: "brand", label: "Chanel" }],
  },
};

const item: ItemDetails = {
  id: "item-1",
  country: "US",
  category: "cat",
  brand: "brand",
  model: "Model A",
  additionalInfo: "Info",
  photos: {
    front: { previewUrl: "http://front", fileId: "f1" },
    back: { previewUrl: null, fileId: null },
    bottom: { previewUrl: null, fileId: null },
    interior: { previewUrl: null, fileId: null },
  },
  dynamicAttributes: { "attr-1": ["small"] },
  dynamicPhotos: {},
  additionalPhotos: [{ previewUrl: "http://extra", fileId: "f2" }],
};

const detailAttributes: DynamicQuestion[] = [
  {
    id: "attr-1",
    name: "Size",
    key: "item-details.attributes.size",
    stage: "item-details",
    field: "size",
    type: "single",
    isRequired: false,
    displayOrder: 1,
    options: [
      { id: "small", label: "Small" },
      { id: "large", label: "Large" },
    ],
  },
];

describe("ReviewStep", () => {
  it("renders item details and images", () => {
    render(
      <ReviewStep
        items={[item]}
        schema={schema}
        detailAttributes={detailAttributes}
        user={{ firstName: "A", lastName: "B", email: "a@b.com" }}
        submitState="idle"
        showErrors={false}
        onUpdateUser={() => undefined}
        onEditItem={() => undefined}
        onEditPhotos={() => undefined}
      />
    );

    expect(screen.getByText("Your Item details")).toBeInTheDocument();
    expect(screen.getByText("Bags")).toBeInTheDocument();
    expect(screen.getByText("Chanel")).toBeInTheDocument();
    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(document.querySelector('img[src="http://front"]')).toBeTruthy();
    expect(document.querySelector('img[src="http://extra"]')).toBeTruthy();
  });

  it("calls edit handlers for item and photos", async () => {
    const onEditItem = jest.fn();
    const onEditPhotos = jest.fn();
    const user = userEvent.setup();
    render(
      <ReviewStep
        items={[item]}
        schema={schema}
        detailAttributes={detailAttributes}
        user={{ firstName: "A", lastName: "B", email: "a@b.com" }}
        submitState="idle"
        showErrors={false}
        onUpdateUser={() => undefined}
        onEditItem={onEditItem}
        onEditPhotos={onEditPhotos}
      />
    );

    const editButtons = screen.getAllByRole("button", { name: "Edit" });
    await user.click(editButtons[0]);
    await user.click(editButtons[1]);

    expect(onEditItem).toHaveBeenCalledWith("item-1");
    expect(onEditPhotos).toHaveBeenCalledWith("item-1");
  });
});
