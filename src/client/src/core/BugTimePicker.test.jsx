import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugTimePicker from "./BugTimePicker";

vi.mock("@mui/x-date-pickers/AdapterDateFns");
vi.mock("@mui/x-date-pickers/LocalizationProvider", () => ({
    LocalizationProvider: ({ children }) => <div>{children}</div>,
}));
vi.mock("@mui/x-date-pickers/TimePicker", () => ({
    TimePicker: () => <input data-testid="time-picker" />,
}));

describe("BugTimePicker", () => {
    it("renders", () => {
        render(<BugTimePicker value={new Date()} onChange={() => {}} />);
    });
});
