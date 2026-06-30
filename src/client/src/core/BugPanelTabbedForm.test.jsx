import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugPanelTabbedForm from "./BugPanelTabbedForm";

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: "/" }),
}));

vi.mock("react-hotkeys-hook", () => ({
    useHotkeys: vi.fn(),
}));

describe("BugPanelTabbedForm", () => {
    it("renders tabs with labels", () => {
        render(
            <BugPanelTabbedForm
                labels={["Tab 1", "Tab 2"]}
                content={[<div key="1">Content 1</div>, <div key="2">Content 2</div>]}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
        expect(screen.getByRole("tab", { name: "Tab 2" })).toBeInTheDocument();
    });

    it("renders tab content", () => {
        render(
            <BugPanelTabbedForm
                labels={["Tab 1", "Tab 2"]}
                content={[<div key="1">Content 1</div>, <div key="2">Content 2</div>]}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByText("Content 1")).toBeInTheDocument();
    });
});
