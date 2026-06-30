import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugConfigFormPanelSelect from "./BugConfigFormPanelSelect";

vi.mock("@hooks/ApiPoller", () => ({
    useApiPoller: () => ({ status: "success", data: [] }),
}));
vi.mock("@core/BugConfigFormSelect");

describe("BugConfigFormPanelSelect", () => {
    it("renders with label", () => {
        render(
            <BugConfigFormPanelSelect
                name="testPanelSelect"
                label="Test Label"
                control={{}}
                capability="test-capability"
            />
        );
    });

    it("renders with helperText", () => {
        render(
            <BugConfigFormPanelSelect
                name="testPanelSelect"
                label="Test"
                control={{}}
                capability="test"
                helperText="Helper text"
            />
        );
    });

    it("renders with disabled", () => {
        render(
            <BugConfigFormPanelSelect name="testPanelSelect" label="Test" control={{}} capability="test" disabled />
        );
    });

    it("renders with fullWidth", () => {
        render(
            <BugConfigFormPanelSelect name="testPanelSelect" label="Test" control={{}} capability="test" fullWidth />
        );
    });

    it("renders with error", () => {
        render(<BugConfigFormPanelSelect name="testPanelSelect" label="Test" control={{}} capability="test" error />);
    });

    it("renders with defaultValue", () => {
        render(
            <BugConfigFormPanelSelect
                name="testPanelSelect"
                label="Test"
                control={{}}
                capability="test"
                defaultValue="panel-1"
            />
        );
    });

    it("renders with rules", () => {
        render(
            <BugConfigFormPanelSelect
                name="testPanelSelect"
                label="Test"
                control={{}}
                capability="test"
                rules={{ required: true }}
            />
        );
    });

    it("renders with mockApiData", () => {
        render(
            <BugConfigFormPanelSelect
                name="testPanelSelect"
                label="Test"
                control={{}}
                capability="test"
                mockApiData={[{ id: "panel-1", title: "Panel 1" }]}
            />
        );
    });
});
