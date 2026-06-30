import { render } from "@testing-library/react";
import BugPoeIcon from "./BugPoeIcon";

describe("BugPoeIcon", () => {
    it("renders icon", () => {
        const { container } = render(<BugPoeIcon />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
    });
});
