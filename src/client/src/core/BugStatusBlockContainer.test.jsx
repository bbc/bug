import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugStatusBlockContainer from "./BugStatusBlockContainer";

vi.mock("@core/BugStatusBlock", () => ({
    default: ({ label }) => <div data-testid="status-block">{label}</div>,
}));

describe("BugStatusBlockContainer", () => {
    it("renders status blocks for items", () => {
        const items = [
            { label: "Block 1", state: "success", items: [] },
            { label: "Block 2", state: "error", items: [] },
        ];

        const { getAllByTestId } = render(<BugStatusBlockContainer items={items} />);
        expect(getAllByTestId("status-block")).toHaveLength(2);
    });

    it("renders grouped blocks in a wrapper", () => {
        const items = [
            { label: "Block 1", state: "success", items: [] },
            [
                { label: "Grouped 1", state: "success", items: [] },
                { label: "Grouped 2", state: "error", items: [] },
            ],
        ];

        const { getAllByTestId } = render(<BugStatusBlockContainer items={items} />);
        expect(getAllByTestId("status-block")).toHaveLength(3);
    });

    it("renders mixed individual and grouped blocks", () => {
        const items = [
            { label: "Block 1", state: "success", items: [] },
            [
                { label: "Left", state: "success", items: [] },
                { label: "Right", state: "warning", items: [] },
            ],
            { label: "Block 2", state: "error", items: [] },
        ];

        const { getAllByTestId } = render(<BugStatusBlockContainer items={items} />);
        expect(getAllByTestId("status-block")).toHaveLength(4);
    });
});
