import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugRestrictTo from "./BugRestrictTo";

vi.mock("react-redux", () => ({
    useSelector: () => ({ data: [] }),
}));

describe("BugRestrictTo", () => {
    it("renders", () => {
        render(
            <BugRestrictTo>
                <div>Test</div>
            </BugRestrictTo>
        );
    });
});
