import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugConfigFormAutocomplete from "./BugConfigFormAutocomplete";

vi.mock("react-hook-form", () => ({
    Controller: ({ render }) => render({ field: { onChange: vi.fn(), value: [], onBlur: vi.fn() } }),
}));

describe("BugConfigFormAutocomplete", () => {
    it("renders with label", () => {
        render(<BugConfigFormAutocomplete name="testAutocomplete" label="Test Label" control={{}} options={[]} />);
    });

    it("renders with options", () => {
        render(
            <BugConfigFormAutocomplete
                name="testAutocomplete"
                label="Test"
                control={{}}
                options={["Option1", "Option2"]}
            />
        );
    });

    it("renders with object options", () => {
        render(
            <BugConfigFormAutocomplete
                name="testAutocomplete"
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
            <BugConfigFormAutocomplete
                name="testAutocomplete"
                label="Test"
                control={{}}
                options={[]}
                helperText="Helper text"
            />
        );
    });

    it("renders with freeSolo", () => {
        render(<BugConfigFormAutocomplete name="testAutocomplete" label="Test" control={{}} options={[]} freeSolo />);
    });

    it("renders with defaultValue", () => {
        render(
            <BugConfigFormAutocomplete
                name="testAutocomplete"
                label="Test"
                control={{}}
                options={["Option1"]}
                defaultValue={["Option1"]}
            />
        );
    });

    it("renders with sort", () => {
        render(
            <BugConfigFormAutocomplete
                name="testAutocomplete"
                label="Test"
                control={{}}
                options={["Z", "A"]}
                defaultValue={["A", "Z"]}
                sort
            />
        );
    });

    it("renders with rules", () => {
        render(
            <BugConfigFormAutocomplete
                name="testAutocomplete"
                label="Test"
                control={{}}
                options={[]}
                rules={{ required: true }}
            />
        );
    });

    it("renders with error", () => {
        render(<BugConfigFormAutocomplete name="testAutocomplete" label="Test" control={{}} options={[]} error />);
    });
});
