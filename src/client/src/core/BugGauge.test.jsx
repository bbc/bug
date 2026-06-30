import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugGauge from "./BugGauge";

vi.mock("react-cool-dimensions", () => ({
    default: ({ children, onResize }) => {
        return {
            observe: vi.fn(),
            width: 200,
            height: 120,
        };
    },
}));

vi.mock("recharts", () => ({
    PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
    Pie: ({ children }) => <div data-testid="pie">{children}</div>,
    Cell: () => <div data-testid="cell" />,
}));

describe("BugGauge", () => {
    it("renders title", () => {
        render(<BugGauge value={50} title="CPU Usage" />);
        expect(screen.getByText("CPU Usage")).toBeInTheDocument();
    });

    it("renders formatted value with unit", () => {
        render(<BugGauge value={75.5} unit="%" decimalPlaces={1} />);
        expect(screen.getByText("75.5%")).toBeInTheDocument();
    });

    it("limits value to max", () => {
        render(<BugGauge value={150} max={100} unit="%" />);
        expect(screen.getByText("100.00%")).toBeInTheDocument();
    });
});
