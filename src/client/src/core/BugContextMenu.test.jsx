import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import BugContextMenu from "./BugContextMenu";

describe("BugContextMenu", () => {
    it("returns null when menuItems is not provided", () => {
        const { container } = render(<BugContextMenu item={{}} anchorEl={null} onClose={vi.fn()} />);
        expect(container.firstChild).toBeNull();
    });

    it("renders menu items when open", () => {
        const mockAnchorEl = document.createElement("div");
        const menuItems = [
            { title: "Edit", onClick: vi.fn() },
            { title: "Delete", onClick: vi.fn() },
        ];

        render(<BugContextMenu item={{ id: 1 }} menuItems={menuItems} anchorEl={mockAnchorEl} onClose={vi.fn()} />);

        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("calls onClick callback when menu item is clicked", async () => {
        const user = userEvent.setup();
        const mockOnClick = vi.fn();
        const mockOnClose = vi.fn();
        const mockAnchorEl = document.createElement("div");
        const item = { id: 1, name: "Test Item" };
        const menuItems = [{ title: "Edit", onClick: mockOnClick }];

        render(<BugContextMenu item={item} menuItems={menuItems} anchorEl={mockAnchorEl} onClose={mockOnClose} />);

        await user.click(screen.getByText("Edit"));

        expect(mockOnClose).toHaveBeenCalled();
        expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object), item);
    });

    it("does not call onClick if menuItem is disabled", async () => {
        const user = userEvent.setup();
        const mockOnClick = vi.fn();
        const mockOnClose = vi.fn();
        const mockAnchorEl = document.createElement("div");
        const menuItems = [{ title: "Delete", onClick: mockOnClick, disabled: true }];

        render(<BugContextMenu item={{ id: 1 }} menuItems={menuItems} anchorEl={mockAnchorEl} onClose={mockOnClose} />);

        const deleteButton = screen.getByText("Delete").closest("li");
        expect(deleteButton).toHaveAttribute("aria-disabled", "true");
    });
});
