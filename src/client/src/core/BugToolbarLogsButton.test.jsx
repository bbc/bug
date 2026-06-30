import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugToolbarLogsButton from "./BugToolbarLogsButton";

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

describe("BugToolbarLogsButton", () => {
    it("renders", () => {
        render(<BugToolbarLogsButton panelId="123" />);
    });
});
