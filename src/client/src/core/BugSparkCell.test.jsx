import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugSparkCell from "./BugSparkCell";

vi.mock("react-sparklines", () => ({
    Sparklines: ({ children, data }) => (
        <div data-testid="sparklines" data-values={data?.length || 0}>
            {children}
        </div>
    ),
    SparklinesLine: () => <div data-testid="sparklines-line" />,
}));

describe("BugSparkCell", () => {
    it("renders sparkline with history", () => {
        const history = [{ value: 10 }, { value: 20 }, { value: 30 }];

        const { getByTestId } = render(<BugSparkCell history={history} />);

        expect(getByTestId("sparklines")).toBeInTheDocument();
    });
});
