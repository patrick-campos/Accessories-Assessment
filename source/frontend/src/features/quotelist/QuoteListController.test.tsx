import { render, screen } from "@testing-library/react";
import { QuoteListController } from "./QuoteListController";

const mockUseQuery = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQuery: (options: unknown) => mockUseQuery(options),
}));

describe("QuoteListController", () => {
  beforeEach(() => {
    mockUseQuery.mockReset();
    process.env.NEXT_PUBLIC_API_ORIGIN = "http://localhost:8080";
  });

  it("renders cards on success", () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: {
        items: [
          {
            id: "quote-1",
            createdAt: "2026-02-08T00:00:00Z",
            status: "Active",
            reference: "REF123",
            items: [
              {
                model: "Model A",
                brand: { name: "Brand A" },
                files: [{ location: "http://image", metadata: { photoSubtype: "Front" } }],
              },
            ],
          },
        ],
      },
    });

    render(<QuoteListController />);

    expect(screen.getByText("ID #REF123")).toBeInTheDocument();
    expect(screen.getByText("Brand A")).toBeInTheDocument();
  });

  it("renders loading overlay when loading", () => {
    mockUseQuery.mockReturnValue({ isLoading: true, data: null });

    const { container } = render(<QuoteListController />);
    const spinner = container.querySelector(".animate-spin");

    expect(spinner).toBeTruthy();
  });
});
