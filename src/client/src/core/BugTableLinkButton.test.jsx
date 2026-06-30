import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import BugTableLinkButton from "./BugTableLinkButton";

describe("BugTableLinkButton", () => {
    it("renders children", () => {
        render(<BugTableLinkButton>Click me</BugTableLinkButton>);
        expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
        const user = userEvent.setup();
        const mockOnClick = vi.fn();
        render(<BugTableLinkButton onClick={mockOnClick}>Link</BugTableLinkButton>);

        await user.click(screen.getByText("Link"));
        expect(mockOnClick).toHaveBeenCalled();
    });
});
