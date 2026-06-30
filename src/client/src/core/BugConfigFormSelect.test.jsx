import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugConfigFormSelect from "./BugConfigFormSelect";

vi.mock("react-hook-form", () => ({
    Controller: ({ render }) => render({ field: { onChange: vi.fn(), value: "" } }),
}));

describe("BugConfigFormSelect", () => {
    it("renders with label", () => {
        render(<BugConfigFormSelect name="testSelect" label="Test Label" control={{}} options={[]} />);
    });

    it("renders with options", () => {
        render(
            <BugConfigFormSelect
                name="testSelect"
                label="Test"
                control={{}}
                options={[
                    { id: "1", label: "Option 1" },
                    { id: "2", label: "Option 2" },
                ]}
            />
        );
    });

    it("renders with helperText", () => {
        render(
            <BugConfigFormSelect name="testSelect" label="Test" control={{}} options={[]} helperText="Helper text" />
        );
    });

    it("renders with disabled", () => {
        render(<BugConfigFormSelect name="testSelect" label="Test" control={{}} options={[]} disabled />);
    });

    it("renders with fullWidth", () => {
        render(<BugConfigFormSelect name="testSelect" label="Test" control={{}} options={[]} fullWidth />);
    });

    it("renders with error", () => {
        render(<BugConfigFormSelect name="testSelect" label="Test" control={{}} options={[]} error />);
    });

    it("renders with defaultValue", () => {
        render(
            <BugConfigFormSelect
                name="testSelect"
                label="Test"
                control={{}}
                options={[{ id: "1", label: "Option" }]}
                defaultValue="1"
            />
        );
    });

    it("renders with rules", () => {
        render(
            <BugConfigFormSelect name="testSelect" label="Test" control={{}} options={[]} rules={{ required: true }} />
        );
    });
});
