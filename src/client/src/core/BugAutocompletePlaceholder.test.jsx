import { render } from "@testing-library/react";
import BugAutocompletePlaceholder from "./BugAutocompletePlaceholder";

describe("BugAutocompletePlaceholder", () => {
    it("renders", () => {
        render(<BugAutocompletePlaceholder value="test" />);
    });
});
