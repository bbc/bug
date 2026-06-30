import { render } from "@testing-library/react";
import BugApiAutocomplete from "./BugApiAutocomplete";

describe("BugApiAutocomplete", () => {
    it("renders", () => {
        render(<BugApiAutocomplete options={[]} value={null} onChange={() => {}} />);
    });
});
