import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugNoData from "./BugNoData";

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

describe("BugNoData", () => {
    it("renders title", () => {
        render(<BugNoData title="Custom Title" showConfigButton={false} />);
        expect(screen.getByText("Custom Title")).toBeInTheDocument();
    });

    it("renders message", () => {
        render(<BugNoData message="Error message" showConfigButton={false} />);
        expect(screen.getByText("Error message")).toBeInTheDocument();
    });
});
