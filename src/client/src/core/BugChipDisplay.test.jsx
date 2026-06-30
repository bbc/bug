import { render, screen } from "@testing-library/react";
import BugChipDisplay from "./BugChipDisplay";

describe("BugChipDisplay", () => {
    it("renders options as chips", () => {
        render(<BugChipDisplay options={["Chip 1", "Chip 2", "Chip 3"]} />);
        expect(screen.getByText("Chip 1")).toBeInTheDocument();
        expect(screen.getByText("Chip 2")).toBeInTheDocument();
        expect(screen.getByText("Chip 3")).toBeInTheDocument();
    });

    it("returns null when options is undefined", () => {
        const { container } = render(<BugChipDisplay />);
        expect(container.firstChild).toBeNull();
    });
});
