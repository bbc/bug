import { render, screen } from "@testing-library/react";
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
});
