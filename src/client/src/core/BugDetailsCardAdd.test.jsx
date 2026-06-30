import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import BugDetailsCardAdd from "./BugDetailsCardAdd";

describe("BugDetailsCardAdd", () => {
    it("renders add button", () => {
        render(<BugDetailsCardAdd onAdd={vi.fn()} />);
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
    });

    it("calls onAdd when button is clicked", async () => {
        const user = userEvent.setup();
        const mockOnAdd = vi.fn();
        render(<BugDetailsCardAdd onAdd={mockOnAdd} />);

        await user.click(screen.getByRole("button"));
        expect(mockOnAdd).toHaveBeenCalled();
    });
});
