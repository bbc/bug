import { render } from "@testing-library/react";
import BugApiButton from "./BugApiButton";

describe("BugApiButton", () => {
    it("renders", () => {
        render(<BugApiButton onClick={() => {}}>Test Button</BugApiButton>);
    });
});
