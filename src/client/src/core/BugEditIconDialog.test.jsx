import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugEditIconDialog from "./BugEditIconDialog";

vi.mock("@core/BugDynamicIcon");
vi.mock("@utils/AxiosPost");
vi.mock("react-colorful", () => ({
    HexColorPicker: () => <div data-testid="color-picker" />,
}));
vi.mock("use-async-effect");
vi.mock("use-debounce", () => ({
    useDebounce: (val) => [val],
}));

describe("BugEditIconDialog", () => {
    it("renders", () => {
        render(<BugEditIconDialog onCancel={() => {}} onSubmit={() => {}} />);
    });
});
