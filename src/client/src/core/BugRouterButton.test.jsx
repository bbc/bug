import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugRouterButton from "./BugRouterButton";

vi.mock("@dnd-kit/sortable", () => ({
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
    }),
}));

vi.mock("use-long-press", () => ({
    useLongPress: () => vi.fn(),
}));

describe("BugRouterButton", () => {
    it("renders primary label", () => {
        render(<BugRouterButton id="btn-1" primaryLabel="Button" onClick={vi.fn()} />);
        expect(screen.getByText("Button")).toBeInTheDocument();
    });

    it("does not call onClick while pending", () => {
        const onClick = vi.fn();
        render(<BugRouterButton id="btn-1" primaryLabel="Button" pending onClick={onClick} />);

        fireEvent.click(screen.getByText("Button"));

        expect(onClick).not.toHaveBeenCalled();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("applies custom buttonColor when provided", () => {
        render(<BugRouterButton id="btn-1" primaryLabel="Button" buttonColor="#123456" onClick={vi.fn()} />);

        const button = screen.getByText("Button").closest("div[role='button']");
        expect(button).toHaveStyle({ backgroundColor: "rgb(18, 52, 86)" });
    });
});
