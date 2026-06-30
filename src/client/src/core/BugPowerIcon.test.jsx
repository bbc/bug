import { render } from "@testing-library/react";
import BugPowerIcon from "./BugPowerIcon";

describe("BugPowerIcon", () => {
    it("renders icon", () => {
        const { container } = render(<BugPowerIcon />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
    });
});
