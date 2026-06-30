import { render } from "@testing-library/react";
import BugVolumeBar from "./BugVolumeBar";

describe("BugVolumeBar", () => {
    it("renders volume bar", () => {
        const { container } = render(<BugVolumeBar value={50} />);
        const box = container.querySelector("div");
        expect(box).toBeInTheDocument();
    });
});
