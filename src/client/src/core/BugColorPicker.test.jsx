import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugColorPicker from "./BugColorPicker";

vi.mock("react-colorful", () => ({
    HexColorPicker: () => <div data-testid="hex-color-picker" />,
}));

describe("BugColorPicker", () => {
    it("renders color picker button", () => {
        render(<BugColorPicker onColorChange={vi.fn()} color="#FF0000" />);
        const button = screen.getByRole("button", { name: /color picker/i });
        expect(button).toBeInTheDocument();
    });
});
