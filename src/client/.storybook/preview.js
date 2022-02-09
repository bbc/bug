import { ThemeProvider as MUIThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "emotion-theming";
import theme from "../src/theme";
import { Provider } from "react-redux";
import reduxStore from "@redux/store";
import { BugCustomDialogProvider } from "@core/BugCustomDialog";
import { BugConfirmDialogProvider } from "@core/BugConfirmDialog";
import { BugRenameDialogProvider } from "@core/BugRenameDialog";
import { MemoryRouter as Router } from "react-router";

export const decorators = [
    (Story) => (
        <Provider store={reduxStore}>
            <BugConfirmDialogProvider>
                <BugCustomDialogProvider>
                    <BugRenameDialogProvider>
                        <StyledEngineProvider injectFirst>
                            <ThemeProvider theme={theme}>
                                <Router>
                                    <Story />
                                </Router>
                            </ThemeProvider>
                        </StyledEngineProvider>
                    </BugRenameDialogProvider>
                </BugCustomDialogProvider>
            </BugConfirmDialogProvider>
        </Provider>
    ),

    (Story) => (
        <>
            <div
                style={{
                    margin: "0",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontFamily: "Roboto",
                    fontWeight: "400",
                    lineHeight: "1.5",
                    backgroundColor: "#181818",
                }}
            >
                <MUIThemeProvider theme={theme}>
                    <ThemeProvider theme={theme}>
                        <>
                            <Story />
                        </>
                    </ThemeProvider>
                </MUIThemeProvider>
            </div>
        </>
    ),
];

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    backgrounds: {
        default: "dark",
        values: [{ name: "dark", value: "#181818" }],
    },
    viewMode: "docs",
    previewTabs: {
        canvas: {
            hidden: true,
        },
    },
    controls: { expanded: true },
};
