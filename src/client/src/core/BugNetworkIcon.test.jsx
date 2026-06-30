import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugNetworkIcon from "./BugNetworkIcon";

vi.mock("./BugDynamicIcon", () => ({
    default: () => <svg data-testid="dynamic-icon" />,
}));

describe("BugNetworkIcon", () => {
    it("renders icon", () => {
        const { container } = render(<BugNetworkIcon />);
        expect(container.querySelector("[data-testid='dynamic-icon']")).toBeInTheDocument();
    });
});
