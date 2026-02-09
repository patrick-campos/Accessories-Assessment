import { render, screen } from "@testing-library/react";
import { QuoteRequestView } from "./QuoteRequestView";
import type { FormSchema } from "./schema";
import type { ItemDetails } from "./types/quoteRequestTypes";

const schema: FormSchema = {
  steps: [
    { id: "details", headerTitle: "1. Item details", inputTitle: "Details", inputSubtitle: "Step 1" },
    { id: "photos", headerTitle: "2. Photos", inputTitle: "Photos", inputSubtitle: "Step 2" },
    { id: "additional", headerTitle: "3. Additional", inputTitle: "Additional", inputSubtitle: "Step 3" },
    { id: "review", headerTitle: "4. Review", inputTitle: "Review", inputSubtitle: "Step 4" },
  ],
  options: {
    countries: [],
    categories: [],
    brands: [],
  },
};

const emptyItem: ItemDetails = {
  id: "item-1",
  country: "",
  category: "",
  brand: "",
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

describe("QuoteRequestView", () => {
  it("renders the first step successfully", () => {
    render(
      <QuoteRequestView
        schema={schema}
        isLoading={false}
        error={null}
        currentStep={0}
        showErrors={false}
        currentItem={emptyItem}
        items={[]}
        user={{ firstName: "A", lastName: "B", email: "a@b.com" }}
        submitState="idle"
        isUploading={false}
        showSuccessModal={false}
        detailAttributes={[]}
        photoAttributes={[]}
        onUpdateItem={() => undefined}
        onUpdatePhoto={() => undefined}
        onUpdateDynamicPhoto={() => undefined}
        onUpdateDynamicAttribute={() => undefined}
        onAddAdditionalPhoto={() => undefined}
        onRemoveAdditionalPhoto={() => undefined}
        onUpdateUser={() => undefined}
        onNext={() => undefined}
        onBack={() => undefined}
        onAddAnother={() => undefined}
        onEditItem={() => undefined}
        onEditPhotos={() => undefined}
        onCloseSuccessModal={() => undefined}
        onRequestAnotherQuote={() => undefined}
        onMyQuotes={() => undefined}
      />
    );

    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("renders a valid step when currentStep is within range", () => {
    render(
      <QuoteRequestView
        schema={schema}
        isLoading={false}
        error={null}
        currentStep={1}
        showErrors={false}
        currentItem={emptyItem}
        items={[]}
        user={{ firstName: "A", lastName: "B", email: "a@b.com" }}
        submitState="idle"
        isUploading={false}
        showSuccessModal={false}
        detailAttributes={[]}
        photoAttributes={[]}
        onUpdateItem={() => undefined}
        onUpdatePhoto={() => undefined}
        onUpdateDynamicPhoto={() => undefined}
        onUpdateDynamicAttribute={() => undefined}
        onAddAdditionalPhoto={() => undefined}
        onRemoveAdditionalPhoto={() => undefined}
        onUpdateUser={() => undefined}
        onNext={() => undefined}
        onBack={() => undefined}
        onAddAnother={() => undefined}
        onEditItem={() => undefined}
        onEditPhotos={() => undefined}
        onCloseSuccessModal={() => undefined}
        onRequestAnotherQuote={() => undefined}
        onMyQuotes={() => undefined}
      />
    );

    expect(screen.getByText("Photos")).toBeInTheDocument();
  });
});

