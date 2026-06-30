import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugConfigFormChipInput from "./BugConfigFormChipInput";

vi.mock("react-hook-form", () => ({
    Controller: ({ render }) => render({ field: { onChange: vi.fn(), value: [], onBlur: vi.fn() } }),
}));

describe("BugConfigFormChipInput", () => {
    it("renders with label", () => {
        render(<BugConfigFormChipInput name="testChips" label="Test Label" control={{}} options={[]} />);
    });

    it("renders with options", () => {
        render(<BugConfigFormChipInput name="testChips" label="Test" control={{}} options={["Option1", "Option2"]} />);
    });

    it("renders with helperText", () => {
        render(
            <BugConfigFormChipInput name="testChips" label="Test" control={{}} options={[]} helperText="Helper text" />
        );
    });

    it("renders with defaultValue", () => {
        render(
            <BugConfigFormChipInput
                name="testChips"
                label="Test"
                control={{}}
                options={["Option1"]}
                defaultValue={["Option1"]}
            />
        );
    });

    it("renders with sort", () => {
        render(
            <BugConfigFormChipInput
                name="testChips"
                label="Test"
                control={{}}
                options={["Z", "A"]}
                defaultValue={["A", "Z"]}
                sort
            />
        );
    });

    it("renders with error", () => {
        render(<BugConfigFormChipInput name="testChips" label="Test" control={{}} options={[]} error />);
    });

    it("renders with rules", () => {
        render(
            <BugConfigFormChipInput
                name="testChips"
                label="Test"
                control={{}}
                options={[]}
                rules={{ required: true }}
            />
        );
    });

    it("renders with children", () => {
        render(
            <BugConfigFormChipInput name="testChips" label="Test" control={{}} options={[]}>
                <div>Child content</div>
            </BugConfigFormChipInput>
        );
    });
});
