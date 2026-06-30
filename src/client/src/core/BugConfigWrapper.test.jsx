import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugConfigWrapper from "./BugConfigWrapper";

vi.mock("@core/BugConfirmDialog", () => ({
    useBugConfirmDialog: () => ({ confirmDialog: vi.fn() }),
}));
vi.mock("@core/BugForm", () => {
    const MockBugForm = ({ children }) => <div data-testid="form">{children}</div>;
    MockBugForm.Header = ({ children }) => <div>{children}</div>;
    MockBugForm.Body = ({ children }) => <div>{children}</div>;
    MockBugForm.Actions = ({ children }) => <div>{children}</div>;
    return { default: MockBugForm };
});
vi.mock("@monaco-editor/react", () => ({
    default: ({ value, onChange }) => (
        <textarea data-testid="editor" value={value} onChange={(e) => onChange(e.target.value)} />
    ),
}));
vi.mock("@utils/AxiosPut");
vi.mock("@utils/Snackbar", () => ({
    useAlert: () => vi.fn(),
}));
vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

describe("BugConfigWrapper", () => {
    it("renders with children", () => {
        render(
            <BugConfigWrapper config={{ id: "test", name: "Test Config" }}>
                <div data-testid="child">Test Content</div>
            </BugConfigWrapper>
        );
        expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("renders with config", () => {
        render(
            <BugConfigWrapper config={{ id: "test-id", name: "Test", value: 123 }}>
                <div>Content</div>
            </BugConfigWrapper>
        );
    });

    it("renders with handleSubmit callback", () => {
        const handleSubmit = vi.fn();
        render(
            <BugConfigWrapper config={{ id: "test" }} handleSubmit={handleSubmit}>
                <div>Content</div>
            </BugConfigWrapper>
        );
    });
});
