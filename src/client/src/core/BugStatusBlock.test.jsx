import { ThemeProvider, createTheme } from "@mui/material/styles";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import BugStatusBlock from "./BugStatusBlock";

vi.mock("react-textfit", () => ({
    Textfit: ({ children }) => <div>{children}</div>,
}));

const theme = createTheme();

describe("BugStatusBlock", () => {
    it("renders without crashing", () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <BugStatusBlock label="Status" state="success" items={["Item 1"]} />
            </ThemeProvider>
        );
        expect(container).toBeInTheDocument();
    });

    it("renders object items with size hints", () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <BugStatusBlock
                    label="Status"
                    state="success"
                    items={[
                        { value: "6016", size: "large" },
                        { value: "Mbps", size: "small" },
                    ]}
                />
            </ThemeProvider>
        );
        expect(container).toBeInTheDocument();
    });

    it("renders spacer state without label or items", () => {
        const { container, queryByText } = render(
            <ThemeProvider theme={theme}>
                <BugStatusBlock label="Spacer" state="spacer" items={["Hidden"]} />
            </ThemeProvider>
        );

        expect(container).toBeInTheDocument();
        expect(queryByText("Spacer")).not.toBeInTheDocument();
        expect(queryByText("Hidden")).not.toBeInTheDocument();
    });
});
