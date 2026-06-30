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
});
