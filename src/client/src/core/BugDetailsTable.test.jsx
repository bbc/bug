import { render, screen } from "@testing-library/react";
import BugDetailsTable from "./BugDetailsTable";

describe("BugDetailsTable", () => {
    it("renders table with items", () => {
        const items = [
            { name: "Status", value: "Active" },
            { name: "Count", value: "42" },
        ];

        render(<BugDetailsTable items={items} />);

        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Active")).toBeInTheDocument();
        expect(screen.getByText("Count")).toBeInTheDocument();
        expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders table with aria-label", () => {
        render(<BugDetailsTable items={[]} />);
        expect(screen.getByLabelText("BUG details table")).toBeInTheDocument();
    });
});
