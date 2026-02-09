import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { DynamicQuestion, ItemDetails } from "../types/quoteRequestTypes";
import type { FormSchema } from "../schema";
import { DetailsStep } from "./DetailsStep";

const schema: FormSchema = {
  steps: [],
  options: {
    countries: [{ value: "US", label: "United States" }],
    categories: [{ value: "cat", label: "Bags" }],
    brands: [{ value: "brand", label: "Chanel" }],
  },
};

const baseItem: ItemDetails = {
  id: "item-1",
  country: "US",
  category: "cat",
  brand: "brand",
  model: "",
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

const requiredQuestion: DynamicQuestion = {
  id: "attr-1",
  name: "Size",
  key: "quote-creation:item-details.attributes.size.title",
  stage: "item-details",
  field: "size",
  type: "OneOf",
  isRequired: true,
  displayOrder: 1,
  options: [{ id: "opt-1", label: "M" }],
};

describe("DetailsStep", () => {
  it("renders fixed inputs and dynamic questions", () => {
    render(
      <DetailsStep
        schema={schema}
        item={baseItem}
        showErrors={false}
        onUpdateItem={() => undefined}
        dynamicAttributes={[requiredQuestion]}
        onUpdateDynamicAttribute={() => undefined}
      />
    );

    expect(screen.getByText("Country/region")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Brand")).toBeInTheDocument();
    expect(screen.getByText("Model")).toBeInTheDocument();
    expect(screen.getByText("Size")).toBeInTheDocument();
  });

  it("shows required error for missing dynamic values", () => {
    render(
      <DetailsStep
        schema={schema}
        item={baseItem}
        showErrors
        onUpdateItem={() => undefined}
        dynamicAttributes={[requiredQuestion]}
        onUpdateDynamicAttribute={() => undefined}
      />
    );

    expect(screen.getAllByText("Required").length).toBeGreaterThan(0);
  });

  it("calls onUpdateItem when model changes", async () => {
    const onUpdateItem = jest.fn();
    const user = userEvent.setup();
    render(
      <DetailsStep
        schema={schema}
        item={baseItem}
        showErrors={false}
        onUpdateItem={onUpdateItem}
        dynamicAttributes={[]}
        onUpdateDynamicAttribute={() => undefined}
      />
    );

    const input = screen.getByPlaceholderText("Enter model");
    await user.type(input, "Classic Flap");

    expect(onUpdateItem).toHaveBeenCalled();
  });
});
