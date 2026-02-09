import { render, screen } from "@testing-library/react";
import { HeaderStep } from "./HeaderStep";

describe("HeaderStep", () => {
  it("renders empty header when items are missing", () => {
    const { container } = render(<HeaderStep Items={null} CurrentIndexOfActiveItem={0} />);
    const header = container.querySelector("header");
    expect(header).toBeTruthy();
    expect(header?.childElementCount).toBe(0);
  });

  it("renders stepper when items are provided", () => {
    render(<HeaderStep Items={["Step 1", "Step 2"]} CurrentIndexOfActiveItem={0} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });
});
