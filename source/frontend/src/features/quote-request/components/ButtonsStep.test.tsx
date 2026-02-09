import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ButtonStep } from "./ButtonsStep";

describe("ButtonStep", () => {
  it("renders when shouldRender is true", () => {
    render(
      <ButtonStep shouldRender variant="outline">
        Next
      </ButtonStep>
    );

    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("does not render when shouldRender is false", () => {
    const { container } = render(
      <ButtonStep shouldRender={false} variant="outline">
        Next
      </ButtonStep>
    );

    expect(container.textContent).toBe("");
  });

  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    render(
      <ButtonStep shouldRender onClick={onClick}>
        Back
      </ButtonStep>
    );

    await user.click(screen.getByText("Back"));
    expect(onClick).toHaveBeenCalled();
  });
});
