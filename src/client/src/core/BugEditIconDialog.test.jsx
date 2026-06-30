import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugEditIconDialog from "./BugEditIconDialog";

vi.mock("@core/BugDynamicIcon", () => ({
    default: ({ icon }) => <div data-testid="bug-dynamic-icon">{icon}</div>,
}));
vi.mock("@utils/AxiosPost", () => ({
    default: vi.fn().mockResolvedValue({ data: { icons: [], length: 0 } }),
}));
vi.mock("react-colorful", () => ({
    HexColorPicker: ({ color }) => <div data-testid="color-picker" data-value={color} />,
}));
vi.mock("use-async-effect", () => ({
    default: () => {},
}));
vi.mock("use-debounce", () => ({
    useDebounce: (val) => [val],
}));

describe("BugEditIconDialog", () => {
    it("renders dialog", () => {
        render(<BugEditIconDialog onCancel={() => {}} onSubmit={() => {}} />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders with default color prop", () => {
        render(<BugEditIconDialog onCancel={() => {}} onSubmit={() => {}} color="#ffffff" />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders with custom color prop", () => {
        render(<BugEditIconDialog onCancel={() => {}} onSubmit={() => {}} color="#FF6900" />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders with custom icon prop", () => {
        render(<BugEditIconDialog onCancel={() => {}} onSubmit={() => {}} icon="home" />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("accepts onCancel and onSubmit callbacks", () => {
        const onCancel = vi.fn();
        const onSubmit = vi.fn();
        render(<BugEditIconDialog onCancel={onCancel} onSubmit={onSubmit} />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
});
