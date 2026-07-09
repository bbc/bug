import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import { fireEvent, render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ConfigPanel from "./ConfigPanel";

const mockValidateServer = vi.fn();

vi.mock("react-redux", () => ({
    useSelector: vi.fn(),
}));

vi.mock("@hooks/ConfigFormHandler", () => ({
    useConfigFormHandler: vi.fn(),
}));

vi.mock("@core/BugLoading", () => ({
    default: () => <div>loading</div>,
}));

vi.mock("@core/BugConfigWrapper", () => ({
    default: ({ children }) => <div>{children}</div>,
}));

vi.mock("@core/BugConfigFormPanelGroup", () => ({
    default: () => <div data-testid="panel-group" />,
}));

vi.mock("@mui/material", () => ({
    Grid: ({ children }) => <div>{children}</div>,
}));

vi.mock("@core/BugConfigFormTextField", () => ({
    default: ({ name, supportsValidation, onChange }) => (
        <div>
            <span>{name}</span>
            {supportsValidation ? (
                <button
                    type="button"
                    data-testid={`validate-${name}`}
                    onClick={() => onChange?.({ target: { value: "1.2.3.4" } })}
                >
                    validate
                </button>
            ) : null}
        </div>
    ),
}));

describe("vislink-lynx ConfigPanel live validation wiring", () => {
    beforeEach(() => {
        mockValidateServer.mockReset();

        vi.mocked(useSelector).mockReturnValue({
            status: "success",
            data: {
                id: "panel-1",
                title: "Title",
                description: "Desc",
                group: "default",
                address: "10.0.0.1",
            },
        });

        vi.mocked(useConfigFormHandler).mockReturnValue({
            handleSubmit: vi.fn(),
            control: {},
            errors: {},
            messages: {},
            validationResults: {},
            validateServer: mockValidateServer,
        });
    });

    it("routes address validation change through validateServer", () => {
        render(<ConfigPanel />);

        const validateButton = screen.getByTestId("validate-address");

        expect(() => fireEvent.click(validateButton)).not.toThrow();
        expect(mockValidateServer).toHaveBeenCalledWith(expect.any(Object), "address");
    });
});
