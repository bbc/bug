import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BugBitrateAutocomplete from "./BugBitrateAutocomplete";

const defaultOptions = [8192, 4096, 2048];

describe("BugBitrateAutocomplete", () => {
    it("renders", () => {
        render(<BugBitrateAutocomplete options={defaultOptions} value={8192} onChange={vi.fn()} />);
    });

    it("displays the current value in kbps", () => {
        render(<BugBitrateAutocomplete options={defaultOptions} value={8192} onChange={vi.fn()} />);
        expect(screen.getByDisplayValue("8192")).toBeInTheDocument();
    });

    it("displays the kbps end adornment", () => {
        render(<BugBitrateAutocomplete options={defaultOptions} value={8192} onChange={vi.fn()} />);
        expect(screen.getByText("kbps")).toBeInTheDocument();
    });

    it("calls onChange with parsed kbps when a value is typed and blurred", () => {
        const handleChange = vi.fn();
        render(<BugBitrateAutocomplete options={defaultOptions} value={8192} onChange={handleChange} />);
        const input = screen.getByDisplayValue("8192");
        fireEvent.change(input, { target: { value: "6144" } });
        fireEvent.blur(input);
        expect(handleChange).toHaveBeenCalledWith(6144);
    });

    it("does not call onChange for non-numeric blur input", () => {
        const handleChange = vi.fn();
        render(<BugBitrateAutocomplete options={defaultOptions} value={8192} onChange={handleChange} />);
        const input = screen.getByDisplayValue("8192");
        fireEvent.change(input, { target: { value: "abc" } });
        fireEvent.blur(input);
        expect(handleChange).not.toHaveBeenCalled();
    });

    it("calls onChange with min when input is non-numeric and min is set", () => {
        const handleChange = vi.fn();
        render(<BugBitrateAutocomplete options={defaultOptions} value={8192} min={2048} onChange={handleChange} />);
        const input = screen.getByDisplayValue("8192");
        fireEvent.change(input, { target: { value: "abc" } });
        fireEvent.blur(input);
        expect(handleChange).toHaveBeenCalledWith(2048);
    });

    it("renders as disabled when disabled prop is set", () => {
        render(<BugBitrateAutocomplete options={defaultOptions} value={8192} onChange={vi.fn()} disabled />);
        expect(screen.getByDisplayValue("8192")).toBeDisabled();
    });

    it("clamps to min when input is below range", () => {
        const handleChange = vi.fn();
        render(
            <BugBitrateAutocomplete
                options={defaultOptions}
                value={8192}
                min={2048}
                max={16384}
                onChange={handleChange}
            />
        );
        const input = screen.getByDisplayValue("8192");
        fireEvent.change(input, { target: { value: "512" } });
        fireEvent.blur(input);
        expect(handleChange).toHaveBeenCalledWith(2048);
    });

    it("clamps to max when input is above range", () => {
        const handleChange = vi.fn();
        render(
            <BugBitrateAutocomplete
                options={defaultOptions}
                value={8192}
                min={2048}
                max={16384}
                onChange={handleChange}
            />
        );
        const input = screen.getByDisplayValue("8192");
        fireEvent.change(input, { target: { value: "32768" } });
        fireEvent.blur(input);
        expect(handleChange).toHaveBeenCalledWith(16384);
    });

    it("calls onChange with unchanged value when within range", () => {
        const handleChange = vi.fn();
        render(
            <BugBitrateAutocomplete
                options={defaultOptions}
                value={8192}
                min={2048}
                max={16384}
                onChange={handleChange}
            />
        );
        const input = screen.getByDisplayValue("8192");
        fireEvent.change(input, { target: { value: "4096" } });
        fireEvent.blur(input);
        expect(handleChange).toHaveBeenCalledWith(4096);
    });
});
