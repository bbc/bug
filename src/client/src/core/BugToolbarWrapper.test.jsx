import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugToolbarWrapper from "./BugToolbarWrapper";

vi.mock("@components/BadgeWrapper");
vi.mock("@components/BugToolbarIcon");
vi.mock("@components/panels/PanelStatus");
vi.mock("@core/BugConfirmDialog", () => ({
    useBugConfirmDialog: () => ({ confirmDialog: vi.fn() }),
}));
vi.mock("@core/BugRestrictTo");
vi.mock("@core/BugToolbarLogsButton");
vi.mock("@utils/AxiosCommand");
vi.mock("@utils/AxiosDelete");
vi.mock("@utils/Snackbar", () => ({
    useAlert: () => vi.fn(),
}));
vi.mock("react-redux", () => ({
    useSelector: () => ({ data: [] }),
}));
vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
    Link: () => null,
}));

describe("BugToolbarWrapper", () => {
    it("renders", () => {
        render(<BugToolbarWrapper />);
    });
});
