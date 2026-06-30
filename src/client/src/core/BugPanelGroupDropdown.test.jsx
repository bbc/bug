import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugPanelGroupDropdown from "./BugPanelGroupDropdown";

vi.mock("react-redux", () => ({
    useSelector: () => ({ data: [{ group: "group1" }] }),
}));

describe("BugPanelGroupDropdown", () => {
    it("renders", () => {
        render(<BugPanelGroupDropdown value="" />);
    });
});
