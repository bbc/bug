import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugDetailsCard from "./BugDetailsCard";

vi.mock("@core/BugDetailsTable", () => ({
    default: ({ items }) => <div data-testid="details-table">{items?.length || 0} items</div>,
}));

describe("BugDetailsCard", () => {
    it("renders title", () => {
        render(<BugDetailsCard title="Test Details" items={[]} />);
        expect(screen.getByText("Test Details")).toBeInTheDocument();
    });

    it("renders items in details table", () => {
        render(<BugDetailsCard title="Test Details" items={[{ label: "Item 1" }, { label: "Item 2" }]} />);
        expect(screen.getByText("2 items")).toBeInTheDocument();
    });
});
