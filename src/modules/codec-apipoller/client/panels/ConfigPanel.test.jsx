import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ConfigPanel from "./ConfigPanel";

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
    default: ({ children }) => <div data-testid="config-wrapper">{children}</div>,
}));

vi.mock("@core/BugConfigFormPanelGroup", () => ({
    default: ({ name }) => <div data-testid="panel-group">group:{name}</div>,
}));

vi.mock("@mui/material", () => ({
    Grid: ({ children }) => <div>{children}</div>,
}));

vi.mock("@core/BugConfigFormTextField", () => ({
    default: ({ name, label, helperText }) => (
        <div data-testid={`field-${name}`}>
            <span>{label}</span>
            {helperText ? <span>{helperText}</span> : null}
        </div>
    ),
}));

describe("codec-apipoller ConfigPanel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useConfigFormHandler).mockReturnValue({
            register: vi.fn(),
            handleSubmit: vi.fn(),
            control: {},
            errors: {},
            validateServer: vi.fn(),
            messages: { url: "URL help" },
        });
    });

    it("renders loading state while panel config is loading", () => {
        vi.mocked(useSelector).mockReturnValue({ status: "loading" });

        render(<ConfigPanel />);

        expect(screen.getByText("loading")).toBeInTheDocument();
    });

    it("renders nothing when panel config is not successful", () => {
        vi.mocked(useSelector).mockReturnValue({ status: "error" });

        const { container } = render(<ConfigPanel />);

        expect(container).toBeEmptyDOMElement();
    });

    it("renders config fields and wires the form handler with panel id", () => {
        vi.mocked(useSelector).mockReturnValue({
            status: "success",
            data: {
                id: "panel-1",
                title: "Codec Panel",
                description: "Codec API",
                group: "default",
                url: "http://example.test/api/codecs",
            },
        });

        render(<ConfigPanel />);

        expect(useConfigFormHandler).toHaveBeenCalledWith({ panelId: "panel-1" });
        expect(screen.getByTestId("config-wrapper")).toBeInTheDocument();
        expect(screen.getByTestId("field-title")).toHaveTextContent("Panel Title");
        expect(screen.getByTestId("field-description")).toHaveTextContent("Description");
        expect(screen.getByTestId("panel-group")).toHaveTextContent("group:group");
        expect(screen.getByTestId("field-url")).toHaveTextContent("API URL");
        expect(screen.getByTestId("field-url")).toHaveTextContent("URL help");
    });
});
