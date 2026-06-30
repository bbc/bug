import { render, screen } from "@testing-library/react";
import BugScrollbars from "./BugScrollbars";

describe("BugScrollbars", () => {
    it("renders children", () => {
        render(
            <BugScrollbars>
                <div>Scrollable content</div>
            </BugScrollbars>
        );
        expect(screen.getByText("Scrollable content")).toBeInTheDocument();
    });
});
