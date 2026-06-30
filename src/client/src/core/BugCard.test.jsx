import { render, screen } from "@testing-library/react";
import BugCard from "./BugCard";

describe("BugCard", () => {
    it("renders children", () => {
        render(
            <BugCard>
                <span>Test content</span>
            </BugCard>
        );
        expect(screen.getByText("Test content")).toBeInTheDocument();
    });
});
