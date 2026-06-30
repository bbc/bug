import { render } from "@testing-library/react";
import BugDragIcon from "./BugDragIcon";

describe("BugDragIcon", () => {
    it("renders icon", () => {
        const { container } = render(<BugDragIcon />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
    });
});
