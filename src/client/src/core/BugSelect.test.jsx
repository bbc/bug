import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugSelect from "./BugSelect";

describe("BugSelect", () => {
    it("renders select component", () => {
        const options = [
            { id: "1", label: "Option 1" },
            { id: "2", label: "Option 2" },
        ];

        const { container } = render(<BugSelect options={options} value="1" onChange={vi.fn()} />);

        const select = container.querySelector(".MuiSelect-root");
        expect(select).toBeInTheDocument();
    });
});
