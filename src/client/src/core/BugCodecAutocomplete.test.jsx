import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugCodecAutocomplete from "./BugCodecAutocomplete";

vi.mock("@utils/AxiosGet");

describe("BugCodecAutocomplete", () => {
    it("renders", () => {
        render(<BugCodecAutocomplete mockApiData={[]} onChange={() => {}} />);
    });
});
