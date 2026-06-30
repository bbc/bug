import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugApiVlanAutocomplete from "./BugApiVlanAutocomplete";

vi.mock("@core/BugApiAutocomplete");
vi.mock("@core/BugCustomDialog", () => ({
    useBugCustomDialog: () => ({ customDialog: vi.fn() }),
}));
vi.mock("@core/BugVlansDialog");

describe("BugApiVlanAutocomplete", () => {
    it("renders", () => {
        render(<BugApiVlanAutocomplete options={[]} taggedValue={[]} untaggedValue={1} onChange={() => {}} />);
    });
});
