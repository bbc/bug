import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugTrafficChart from "./BugTrafficChart";

vi.mock("@core/BugTimePicker");
vi.mock("@utils/AxiosGet");
vi.mock("@utils/format-bps");
vi.mock("@utils/WindowSize", () => ({
    useWindowSize: () => ({ width: 800, height: 600 }),
}));
vi.mock("recharts");
vi.mock("use-async-effect");

describe("BugTrafficChart", () => {
    it("renders", () => {
        render(<BugTrafficChart url="/api/traffic" />);
    });
});
