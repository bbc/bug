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

    it("renders footer alert when provided", () => {
        render(
            <BugDetailsCard
                title="Test Details"
                items={[]}
                footerAlert={{
                    severity: "warning",
                    title: "Attention",
                    message: "Panel connection is unstable.",
                }}
            />
        );

        expect(screen.getByText("Attention")).toBeInTheDocument();
        expect(screen.getByText("Panel connection is unstable.")).toBeInTheDocument();
    });

    it("does not render footer alert when missing", () => {
        render(<BugDetailsCard title="Test Details" items={[]} />);
        expect(screen.queryByText("Panel connection is unstable.")).not.toBeInTheDocument();
    });
});
