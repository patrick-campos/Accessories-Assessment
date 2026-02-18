import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
        onClearError={() => undefined}
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
        onClearError={() => undefined}
        onRequestAnotherQuote={() => undefined}
        onMyQuotes={() => undefined}
      />
    );

    expect(screen.getByText("Photos")).toBeInTheDocument();
  });

  it("shows api error modal when error is present", () => {
    render(
      <QuoteRequestView
        schema={schema}
        isLoading={false}
        error="API failed"
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
        onClearError={() => undefined}
        onRequestAnotherQuote={() => undefined}
        onMyQuotes={() => undefined}
      />
    );

    expect(screen.getByText("Request failed")).toBeInTheDocument();
    expect(screen.getByText("API failed")).toBeInTheDocument();
  });

  it("disables the next button while uploading", () => {
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
        isUploading={true}
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
        onClearError={() => undefined}
        onRequestAnotherQuote={() => undefined}
        onMyQuotes={() => undefined}
      />
    );

    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeDisabled();
  });

  it("shows success modal and triggers actions", async () => {
    const onCloseSuccessModal = jest.fn();
    const onRequestAnotherQuote = jest.fn();
    const onMyQuotes = jest.fn();
    const user = userEvent.setup();

    render(
      <QuoteRequestView
        schema={schema}
        isLoading={false}
        error={null}
        currentStep={3}
        showErrors={false}
        currentItem={emptyItem}
        items={[]}
        user={{ firstName: "A", lastName: "B", email: "a@b.com" }}
        submitState="success"
        isUploading={false}
        showSuccessModal={true}
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
        onCloseSuccessModal={onCloseSuccessModal}
        onClearError={() => undefined}
        onRequestAnotherQuote={onRequestAnotherQuote}
        onMyQuotes={onMyQuotes}
      />
    );

    expect(screen.getByText("We'll be in touch soon")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Request Another Quote" }));
    expect(onRequestAnotherQuote).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "My Quotes" }));
    expect(onMyQuotes).toHaveBeenCalled();

    const closeButton = screen.getByRole("button", { name: /✕/i });
    await user.click(closeButton);
    expect(onCloseSuccessModal).toHaveBeenCalled();
  });
});

