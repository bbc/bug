import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import BugTextField from "./BugTextField";

describe("BugTextField", () => {
    it("renders text field", () => {
        const { container } = render(<BugTextField value="" onChange={vi.fn()} />);
        expect(container.querySelector(".MuiTextField-root")).toBeInTheDocument();
    });

    it("calls onChange when text is entered", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();
        render(<BugTextField value="" onChange={mockOnChange} />);

        const input = screen.getByRole("textbox");
        await user.type(input, "test");
        expect(mockOnChange).toHaveBeenCalled();
    });
});
