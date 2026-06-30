import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugConfigFormTextField from "./BugConfigFormTextField";

vi.mock("react-hook-form", () => ({
    Controller: ({ render }) => render({ field: { onChange: vi.fn(), value: "" } }),
}));
vi.mock("@core/BugTextField");

describe("BugConfigFormTextField", () => {
    it("renders with label", () => {
        render(<BugConfigFormTextField name="testField" label="Test Label" control={{}} />);
    });

    it("renders with helperText", () => {
        render(<BugConfigFormTextField name="testField" label="Test" control={{}} helperText="Helper text" />);
    });

    it("renders with disabled", () => {
        render(<BugConfigFormTextField name="testField" label="Test" control={{}} disabled />);
    });

    it("renders with numeric", () => {
        render(<BugConfigFormTextField name="testField" label="Test" control={{}} numeric />);
    });

    it("renders with validation", () => {
        render(
            <BugConfigFormTextField
                name="testField"
                label="Test"
                control={{}}
                supportsValidation
                rules={{ required: true }}
            />
        );
    });

    it("renders with min/max", () => {
        render(<BugConfigFormTextField name="testField" label="Test" control={{}} min={0} max={100} />);
    });

    it("renders with filter", () => {
        render(<BugConfigFormTextField name="testField" label="Test" control={{}} filter="[0-9]" />);
    });

    it("renders with type", () => {
        render(<BugConfigFormTextField name="testField" label="Test" control={{}} type="email" />);
    });

    it("renders with InputProps", () => {
        render(<BugConfigFormTextField name="testField" label="Test" control={{}} InputProps={{ maxLength: 100 }} />);
    });
});
