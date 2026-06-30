import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugPowerChart from "./BugPowerChart";

vi.mock("@core/BugTimePicker", () => ({
    default: () => <div data-testid="time-picker" />,
}));

vi.mock("@utils/AxiosGet", () => ({
    default: vi.fn(),
}));

vi.mock("@utils/hslToHex", () => ({
    default: vi.fn((hsl) => "#000000"),
}));

vi.mock("@utils/WindowSize", () => ({
    useWindowSize: () => ({ width: 800, height: 600 }),
}));

vi.mock("recharts", () => ({
    ComposedChart: ({ children }) => <div data-testid="chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    Tooltip: () => <div data-testid="tooltip" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
}));

vi.mock("use-async-effect", () => ({
    default: vi.fn(),
}));

describe("BugPowerChart", () => {
    it("renders chart container", () => {
        const { container } = render(<BugPowerChart streamType="power" receiver="1" name="Power Monitor" />);
        expect(container).toBeInTheDocument();
    });
});
