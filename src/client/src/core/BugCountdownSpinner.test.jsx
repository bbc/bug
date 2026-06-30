import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugCountdownSpinner from "./BugCountdownSpinner";

vi.mock("@hooks/Interval", () => ({
    useInterval: vi.fn(),
}));

describe("BugCountdownSpinner", () => {
    it("renders circular progress", () => {
        const { container } = render(<BugCountdownSpinner duration={3000} />);
        const progress = container.querySelector(".MuiCircularProgress-root");
        expect(progress).toBeInTheDocument();
    });

    it("renders with default duration", () => {
        const { container } = render(<BugCountdownSpinner />);
        const progress = container.querySelector(".MuiCircularProgress-svg");
        expect(progress).toBeInTheDocument();
    });
});
