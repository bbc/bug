import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugModuleWrapper from "./BugModuleWrapper";

vi.mock("@components/panels/PanelBusy");
vi.mock("@components/panels/PanelCritical");
vi.mock("@components/panels/PanelRestarting");
vi.mock("@components/panels/PanelStopped");
vi.mock("@core/BugLoading");
vi.mock("@data/PanelHandler");
vi.mock("@redux/pageTitleSlice", () => ({
    default: { actions: { set: vi.fn() } },
}));
vi.mock("react-redux", () => ({
    useSelector: () => ({ data: { enabled: true }, status: "idle" }),
    useDispatch: () => vi.fn(),
}));
vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

describe("BugModuleWrapper", () => {
    it("renders", () => {
        render(
            <BugModuleWrapper panelId="123">
                <div>Test</div>
            </BugModuleWrapper>
        );
    });
});
