import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugRouterGroupButton from "./BugRouterGroupButton";

vi.mock("@dnd-kit/sortable", () => ({
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
    }),
}));

vi.mock("@components/BugItemMenu", () => ({
    default: () => <div data-testid="item-menu" />,
}));

describe("BugRouterGroupButton", () => {
    it("renders primary label", () => {
        render(<BugRouterGroupButton id="btn-1" primaryLabel="Group" onClick={vi.fn()} />);
        expect(screen.getByText("Group")).toBeInTheDocument();
    });

    it("applies buttonColor when provided", () => {
        const { container } = render(
            <BugRouterGroupButton id="btn-2" primaryLabel="Group" onClick={vi.fn()} buttonColor="warning" />
        );
        const button = container.querySelector(".MuiButton-root");
        expect(button).toBeInTheDocument();
    });

    it("renders without buttonColor by default", () => {
        const { container } = render(<BugRouterGroupButton id="btn-3" primaryLabel="Group" onClick={vi.fn()} />);
        const button = container.querySelector(".MuiButton-root");
        expect(button).toBeInTheDocument();
    });
});
