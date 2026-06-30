import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugTimeZonePicker from "./BugTimeZonePicker";

vi.mock("timezones.json", () => ({
    default: [{ text: "UTC", value: "UTC" }],
}));

describe("BugTimeZonePicker", () => {
    it("renders", () => {
        render(<BugTimeZonePicker label="Timezone" />);
    });
});
