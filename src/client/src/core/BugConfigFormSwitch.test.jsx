import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugConfigFormSwitch from "./BugConfigFormSwitch";

vi.mock("react-hook-form", () => ({
    Controller: ({ render }) => render({ field: { onChange: vi.fn(), value: false } }),
}));
vi.mock("@components/BugHelperText", () => ({
    default: ({ children }) => <div data-testid="helper-text">{children}</div>,
}));

describe("BugConfigFormSwitch", () => {
    it("renders with label", () => {
        render(<BugConfigFormSwitch name="testSwitch" label="Enable Feature" control={{}} />);
        expect(screen.getByText("Enable Feature")).toBeInTheDocument();
    });

    it("renders with helperText", () => {
        render(<BugConfigFormSwitch name="testSwitch" label="Test" control={{}} helperText="This is helpful" />);
        expect(screen.getByTestId("helper-text")).toHaveTextContent("This is helpful");
    });

    it("renders with defaultValue", () => {
        render(<BugConfigFormSwitch name="testSwitch" label="Test" control={{}} defaultValue={true} />);
    });

    it("renders with rules", () => {
        render(<BugConfigFormSwitch name="testSwitch" label="Test" control={{}} rules={{ required: true }} />);
    });

    it("renders with sort prop", () => {
        render(<BugConfigFormSwitch name="testSwitch" label="Test" control={{}} sort={1} />);
    });
});
