import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AxiosPut from "@utils/AxiosPut";
import BugConfigWrapper from "./BugConfigWrapper";

const { sendAlert, navigate } = vi.hoisted(() => ({ sendAlert: vi.fn(), navigate: vi.fn() }));

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
    useAlert: () => sendAlert,
}));
vi.mock("react-router-dom", () => ({
    useNavigate: () => navigate,
}));

describe("BugConfigWrapper", () => {
    beforeEach(() => vi.clearAllMocks());

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

    it.each([
        [{ status: "success", data: true, delivery: "pending" }, "saved, but delivery", "warning", true],
        [{ status: "success", data: true, delivery: "accepted" }, "has been updated", "success", true],
        [false, "could not be updated", "warning", false],
    ])("reports the saved and delivery result", async (response, message, variant, navigates) => {
        vi.mocked(AxiosPut).mockResolvedValue(response);
        const handleSubmit = (submit) => (event) => {
            event.preventDefault();
            return submit({ address: "example" });
        };
        render(<BugConfigWrapper config={{ id: "panel", title: "Panel" }} handleSubmit={handleSubmit} />);

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        await waitFor(() => {
            expect(sendAlert).toHaveBeenCalledWith(
                expect.stringContaining(message),
                expect.objectContaining({ variant })
            );
        });
        expect(navigate).toHaveBeenCalledTimes(navigates ? 1 : 0);
    });
});
