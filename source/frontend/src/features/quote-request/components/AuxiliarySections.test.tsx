import { render, screen } from "@testing-library/react";
import type { StepSchema } from "../schema";
import { AuxiliarySections } from "./AuxiliarySections";

const step: StepSchema = {
  id: "details",
  headerTitle: "1",
  inputTitle: "Details",
  inputSubtitle: "Subtitle",
  auxSections: [
    { title: "Section A", body: "Body A" },
    { title: "Section B", body: ["One", "Two"] },
  ],
  footerHelp: {
    title: "Need help?",
    links: [{ label: "Contact", href: "#" }],
  },
};

describe("AuxiliarySections", () => {
  it("renders sections and footer links", () => {
    render(<AuxiliarySections step={step} />);

    expect(screen.getAllByText("Section A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Body A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("One").length).toBeGreaterThan(0);
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders without content when step is undefined", () => {
    const { container } = render(<AuxiliarySections step={undefined} />);
    expect(container).toBeTruthy();
  });
});
