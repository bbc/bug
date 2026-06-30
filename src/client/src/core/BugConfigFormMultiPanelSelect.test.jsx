import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugConfigFormMultiPanelSelect from "./BugConfigFormMultiPanelSelect";

vi.mock("@hooks/ApiPoller", () => ({
    useApiPoller: () => ({ status: "success", data: [] }),
}));

vi.mock("react-hook-form", () => ({
    Controller: ({ render }) => render({ field: { onChange: vi.fn(), value: [], onBlur: vi.fn() } }),
}));

describe("BugConfigFormMultiPanelSelect", () => {
    it("renders with label", () => {
        render(
            <BugConfigFormMultiPanelSelect
                name="testMultiPanels"
                label="Test Label"
                control={{}}
                capability="test-capability"
            />
        );
    });

    it("renders with helperText", () => {
        render(
            <BugConfigFormMultiPanelSelect
                name="testMultiPanels"
                label="Test"
                control={{}}
                capability="test"
                helperText="Helper text"
            />
        );
    });

    it("renders with error", () => {
        render(
            <BugConfigFormMultiPanelSelect name="testMultiPanels" label="Test" control={{}} capability="test" error />
        );
    });

    it("renders with defaultValue", () => {
        render(
            <BugConfigFormMultiPanelSelect
                name="testMultiPanels"
                label="Test"
                control={{}}
                capability="test"
                defaultValue={["panel-1"]}
            />
        );
    });

    it("renders with rules", () => {
        render(
            <BugConfigFormMultiPanelSelect
                name="testMultiPanels"
                label="Test"
                control={{}}
                capability="test"
                rules={{ required: true }}
            />
        );
    });

    it("renders with mockApiData", () => {
        render(
            <BugConfigFormMultiPanelSelect
                name="testMultiPanels"
                label="Test"
                control={{}}
                capability="test"
                mockApiData={[{ id: "panel-1", title: "Panel 1" }]}
            />
        );
    });

    it("renders with children", () => {
        render(
            <BugConfigFormMultiPanelSelect name="testMultiPanels" label="Test" control={{}} capability="test">
                <div>Child content</div>
            </BugConfigFormMultiPanelSelect>
        );
    });
});
