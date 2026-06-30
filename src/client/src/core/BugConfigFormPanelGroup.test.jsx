import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugConfigFormPanelGroup from "./BugConfigFormPanelGroup";

vi.mock("@core/BugPanelGroupDropdown");

vi.mock("react-hook-form", () => ({
    Controller: ({ render }) => render({ field: { ref: null, onChange: vi.fn(), value: "" } }),
}));

describe("BugConfigFormPanelGroup", () => {
    it("renders with label", () => {
        render(<BugConfigFormPanelGroup name="testPanelGroup" control={{}} />);
    });

    it("renders with defaultValue", () => {
        render(<BugConfigFormPanelGroup name="testPanelGroup" control={{}} defaultValue="group1" />);
    });

    it("renders with fullWidth", () => {
        render(<BugConfigFormPanelGroup name="testPanelGroup" control={{}} fullWidth />);
    });

    it("renders with fullWidth false", () => {
        render(<BugConfigFormPanelGroup name="testPanelGroup" control={{}} fullWidth={false} />);
    });
});
