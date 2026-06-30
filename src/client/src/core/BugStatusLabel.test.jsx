import { render, screen } from "@testing-library/react";
import BugStatusLabel from "./BugStatusLabel";

describe("BugStatusLabel", () => {
    it("renders children", () => {
        render(<BugStatusLabel>Active</BugStatusLabel>);
        expect(screen.getByText("Active")).toBeInTheDocument();
    });
});
