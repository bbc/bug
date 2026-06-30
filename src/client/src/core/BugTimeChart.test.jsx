import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugTimeChart from "./BugTimeChart";

vi.mock("@core/BugTimePicker");
vi.mock("@utils/AxiosGet");
vi.mock("@utils/hslToHex");
vi.mock("@utils/WindowSize", () => ({
    useWindowSize: () => ({ width: 800, height: 600 }),
}));
vi.mock("recharts");
vi.mock("use-async-effect");

describe("BugTimeChart", () => {
    it("renders", () => {
        render(<BugTimeChart streamType="latency" name="Time Monitor" />);
    });
});
