import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugConfigFormPasswordTextField from "./BugConfigFormPasswordTextField";

vi.mock("react-hook-form", () => ({
    Controller: ({ render }) => render({ field: { onChange: vi.fn(), value: "" } }),
}));
vi.mock("@core/BugPasswordTextField");

describe("BugConfigFormPasswordTextField", () => {
    it("renders with label", () => {
        render(<BugConfigFormPasswordTextField name="testPassword" label="Test Label" control={{}} />);
    });

    it("renders with helperText", () => {
        render(
            <BugConfigFormPasswordTextField name="testPassword" label="Test" control={{}} helperText="Helper text" />
        );
    });

    it("renders with disabled", () => {
        render(<BugConfigFormPasswordTextField name="testPassword" label="Test" control={{}} disabled />);
    });

    it("renders with supportsValidation", () => {
        render(<BugConfigFormPasswordTextField name="testPassword" label="Test" control={{}} supportsValidation />);
    });

    it("renders with allowShowPassword", () => {
        render(
            <BugConfigFormPasswordTextField name="testPassword" label="Test" control={{}} allowShowPassword={false} />
        );
    });

    it("renders with variant", () => {
        render(<BugConfigFormPasswordTextField name="testPassword" label="Test" control={{}} variant="outlined" />);
    });

    it("renders with defaultValue", () => {
        render(<BugConfigFormPasswordTextField name="testPassword" label="Test" control={{}} defaultValue="initial" />);
    });

    it("renders with rules", () => {
        render(
            <BugConfigFormPasswordTextField name="testPassword" label="Test" control={{}} rules={{ required: true }} />
        );
    });

    it("renders with error", () => {
        render(<BugConfigFormPasswordTextField name="testPassword" label="Test" control={{}} error />);
    });
});
