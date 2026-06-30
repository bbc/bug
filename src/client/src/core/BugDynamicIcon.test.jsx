import { render } from "@testing-library/react";
import BugDynamicIcon from "./BugDynamicIcon";

describe("BugDynamicIcon", () => {
    it("renders nothing when iconName is undefined", () => {
        const { container } = render(<BugDynamicIcon />);
        expect(container.firstChild).toBeNull();
    });

    it("renders icon for valid iconName", () => {
        const { container } = render(<BugDynamicIcon iconName="Settings" />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
    });
});
