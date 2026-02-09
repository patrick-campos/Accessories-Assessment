import { render } from "@testing-library/react";
import { QuoteRequestController } from "./QuoteRequestController";
import type { FormSchema } from "./schema";

const mockUseQuoteRequestQueries = jest.fn();
const mockUseQuoteRequestUploads = jest.fn();
const mockUseQuoteRequestSubmit = jest.fn();
const mockPush = jest.fn();
const mockQuoteRequestView = jest.fn(() => <div data-testid="quote-request-view" />);

jest.mock("next/router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("./hooks/useQuoteRequestQueries", () => ({
  useQuoteRequestQueries: (arg: unknown) => mockUseQuoteRequestQueries(arg),
}));

jest.mock("./hooks/useQuoteRequestUploads", () => ({
  useQuoteRequestUploads: (arg: unknown) => mockUseQuoteRequestUploads(arg),
}));

jest.mock("./hooks/useQuoteRequestSubmit", () => ({
  useQuoteRequestSubmit: (arg: unknown) => mockUseQuoteRequestSubmit(arg),
}));

jest.mock("./QuoteRequestView", () => ({
  QuoteRequestView: (props: unknown) => mockQuoteRequestView(props),
}));

const schema: FormSchema = {
  steps: [
    { id: "details", headerTitle: "1", inputTitle: "Details", inputSubtitle: "Step 1" },
    { id: "photos", headerTitle: "2", inputTitle: "Photos", inputSubtitle: "Step 2" },
    { id: "additional", headerTitle: "3", inputTitle: "Additional", inputSubtitle: "Step 3" },
    { id: "review", headerTitle: "4", inputTitle: "Review", inputSubtitle: "Step 4" },
  ],
  options: { countries: [], categories: [], brands: [] },
};

describe("QuoteRequestController", () => {
  beforeEach(() => {
    mockUseQuoteRequestQueries.mockReset();
    mockUseQuoteRequestUploads.mockReset();
    mockUseQuoteRequestSubmit.mockReset();
    mockQuoteRequestView.mockClear();
  });

  it("passes success state to the view", () => {
    mockUseQuoteRequestQueries.mockReturnValue({
      apiOrigin: null,
      schema,
      detailAttributes: [],
      photoAttributes: [],
      isLoading: false,
      error: null,
    });
    mockUseQuoteRequestUploads.mockReturnValue({
      updatePhoto: jest.fn(),
      updateDynamicPhoto: jest.fn(),
      addAdditionalPhoto: jest.fn(),
      removeAdditionalPhoto: jest.fn(),
      uploadingCount: 0,
    });
    mockUseQuoteRequestSubmit.mockReturnValue({
      submitRequest: jest.fn(),
    });

    render(<QuoteRequestController />);

    expect(mockQuoteRequestView).toHaveBeenCalled();
    const props = mockQuoteRequestView.mock.calls[0][0] as { error: string | null; isUploading: boolean };
    expect(props.error).toBeNull();
    expect(props.isUploading).toBe(false);
  });

  it("passes error state to the view when queries fail", () => {
    mockUseQuoteRequestQueries.mockReturnValue({
      apiOrigin: null,
      schema,
      detailAttributes: [],
      photoAttributes: [],
      isLoading: false,
      error: new Error("fail"),
    });
    mockUseQuoteRequestUploads.mockReturnValue({
      updatePhoto: jest.fn(),
      updateDynamicPhoto: jest.fn(),
      addAdditionalPhoto: jest.fn(),
      removeAdditionalPhoto: jest.fn(),
      uploadingCount: 1,
    });
    mockUseQuoteRequestSubmit.mockReturnValue({
      submitRequest: jest.fn(),
    });

    render(<QuoteRequestController />);

    expect(mockQuoteRequestView).toHaveBeenCalled();
    const props = mockQuoteRequestView.mock.calls[0][0] as { error: string | null; isUploading: boolean };
    expect(props.error).toBe("Falha ao carregar o formulario");
    expect(props.isUploading).toBe(true);
  });
});

