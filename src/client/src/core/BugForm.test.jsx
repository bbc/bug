import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugForm from "./BugForm";

vi.mock("react-hotkeys-hook", () => ({
    useHotkeys: vi.fn(),
}));

describe("BugForm", () => {
    it("renders with children", () => {
        render(
            <BugForm>
                <div data-testid="child">Test Content</div>
            </BugForm>
        );
        expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("renders with onClose button", () => {
        render(
            <BugForm onClose={() => {}}>
                <div>Content</div>
            </BugForm>
        );
        expect(screen.getByLabelText("close")).toBeInTheDocument();
    });

    it("renders Header subcomponent", () => {
        render(
            <BugForm.Header>
                <div data-testid="header-content">Header Text</div>
            </BugForm.Header>
        );
        expect(screen.getByTestId("header-content")).toBeInTheDocument();
    });

    it("renders Body subcomponent", () => {
        render(
            <BugForm.Body>
                <div data-testid="body-content">Body Text</div>
            </BugForm.Body>
        );
        expect(screen.getByTestId("body-content")).toBeInTheDocument();
    });

    it("renders Actions subcomponent", () => {
        render(
            <BugForm.Actions>
                <div data-testid="actions-content">Actions</div>
            </BugForm.Actions>
        );
        expect(screen.getByTestId("actions-content")).toBeInTheDocument();
    });

    it("renders with iconButtons", () => {
        render(
            <BugForm
                iconButtons={[
                    <button key="1" data-testid="icon-btn">
                        Icon Btn
                    </button>,
                ]}
            >
                <div>Content</div>
            </BugForm>
        );
        expect(screen.getByTestId("icon-btn")).toBeInTheDocument();
    });

    it("renders Header with custom sx", () => {
        render(<BugForm.Header sx={{ padding: "32px" }}>Header</BugForm.Header>);
    });

    it("renders Body with custom sx", () => {
        render(<BugForm.Body sx={{ padding: "32px" }}>Body</BugForm.Body>);
    });

    it("renders Actions with custom sx", () => {
        render(<BugForm.Actions sx={{ padding: "32px" }}>Actions</BugForm.Actions>);
    });
});
