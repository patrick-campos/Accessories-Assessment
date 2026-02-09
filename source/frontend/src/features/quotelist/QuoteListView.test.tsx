import { render, screen } from "@testing-library/react";
import { QuoteListView } from "./QuoteListView";

describe("QuoteListView", () => {
  it("renders items successfully", () => {
    render(
      <QuoteListView
        items={
          <div>
            <span>Item A</span>
          </div>
        }
      />
    );

    expect(screen.getByText("MY QUOTES")).toBeInTheDocument();
    expect(screen.getByText("Item A")).toBeInTheDocument();
  });

  it("renders header even when no items are provided", () => {
    render(<QuoteListView items={null} />);

    expect(screen.getByText("MY QUOTES")).toBeInTheDocument();
    expect(screen.queryByText("Item A")).not.toBeInTheDocument();
  });
});
