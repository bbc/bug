import { render } from "@testing-library/react";
import BugApiSwitch from "./BugApiSwitch";

describe("BugApiSwitch", () => {
    it("renders", () => {
        render(<BugApiSwitch checked={false} onChange={() => {}} />);
    });
});
