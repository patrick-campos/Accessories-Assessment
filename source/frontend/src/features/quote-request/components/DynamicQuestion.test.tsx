import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { DynamicQuestion, UploadedPhotoSlot } from "../types/quoteRequestTypes";
import { DynamicQuestion as DynamicQuestionComponent } from "./DynamicQuestion";

const baseQuestion: DynamicQuestion = {
  id: "attr-1",
  name: "Condition",
  key: "quote-creation:item-details.attributes.condition.title",
  stage: "item-details",
  field: "condition",
  type: "OneOf",
  isRequired: true,
  displayOrder: 1,
  options: [
    { id: "opt-1", label: "Good" },
    { id: "opt-2", label: "Fair" },
  ],
};

describe("DynamicQuestion", () => {
  it("renders select for OneOf and calls onChange", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <DynamicQuestionComponent question={baseQuestion} showErrors={false} values={[]} onChange={onChange} />
    );

    const trigger = screen.getByRole("button", { name: /select/i });
    await user.click(trigger);
    await user.click(screen.getByText("Good"));

    expect(onChange).toHaveBeenCalledWith(["opt-1"]);
  });

  it("renders chips for AnyOf and toggles values", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <DynamicQuestionComponent
        question={{ ...baseQuestion, type: "AnyOf" }}
        showErrors={false}
        values={[]}
        onChange={onChange}
      />
    );

    await user.click(screen.getByText("Good"));
    expect(onChange).toHaveBeenCalledWith(["opt-1"]);
  });

  it("renders photo input for item-photos stage", () => {
    const photoQuestion: DynamicQuestion = {
      ...baseQuestion,
      stage: "item-photos",
      type: "Photo",
      options: [],
    };
    const photo: UploadedPhotoSlot = { previewUrl: null, fileId: null };
    render(
      <DynamicQuestionComponent
        question={photoQuestion}
        showErrors={true}
        photo={photo}
        onFileChange={() => undefined}
      />
    );

    expect(screen.getByText("Condition")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
