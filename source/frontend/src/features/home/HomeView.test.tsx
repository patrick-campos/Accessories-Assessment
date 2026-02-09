import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomeView } from "./HomeView";

const mockPush = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("HomeView", () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it("renders hero content successfully", () => {
    const { container } = render(<HomeView />);

    expect(screen.getAllByText(/SELL YOUR DESIGNER BAGS/i).length).toBeGreaterThan(0);
    const image = container.querySelector('img[src="/images/home_brand.jpeg"]');
    expect(image).toBeTruthy();
  });

  it("navigates to quote when CTA is clicked", async () => {
    const user = userEvent.setup();
    render(<HomeView />);

    const button = screen.getByRole("button", { name: /start selling/i });
    await user.click(button);

    expect(mockPush).toHaveBeenCalled();
  });
});
