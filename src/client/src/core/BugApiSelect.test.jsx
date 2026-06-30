import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugApiSelect from "./BugApiSelect";

vi.mock("@core/BugSelect");

describe("BugApiSelect", () => {
    it("renders", () => {
        render(<BugApiSelect options={[]} value="" onChange={() => {}} />);
    });
});
