import { render } from "@testing-library/react";
import BugLoading from "./BugLoading";

describe("BugLoading", () => {
    it("renders loading spinner", () => {
        const { container } = render(<BugLoading />);
        const progress = container.querySelector(".MuiCircularProgress-root");
        expect(progress).toBeInTheDocument();
    });

    it("renders with custom height", () => {
        const { container } = render(<BugLoading height="500px" />);
        const grid = container.querySelector(".MuiGrid-root");
        expect(grid).toBeInTheDocument();
    });
});
