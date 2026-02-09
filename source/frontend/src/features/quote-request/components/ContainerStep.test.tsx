import { render, screen } from "@testing-library/react";
import { ContainerStep } from "./ContainerStep";

describe("ContainerStep", () => {
  it("renders children", () => {
    render(
      <ContainerStep>
        <span>Child</span>
      </ContainerStep>
    );

    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
