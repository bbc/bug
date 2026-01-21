import { ThemeProvider } from "@emotion/react";
import { ThemeProvider as MUIThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { fn } from "@storybook/test";
import { themes } from "@storybook/theming";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router";

import { BugConfirmDialogProvider } from "@core/BugConfirmDialog";
import { BugCustomDialogProvider } from "@core/BugCustomDialog";
import { BugRenameDialogProvider } from "@core/BugRenameDialog";
import reduxStore from "@redux/store";
import theme from "../src/theme";

const appTheme = theme();

/** @type { import('@storybook/react').Preview } */
const preview = {
    args: {
        onClick: fn(),
        onChange: fn(),
        onSubmit: fn(),
    },

    parameters: {
        controls: {
            expanded: true,
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#181818" }],
        },
        docs: {
            theme: themes.dark,
        },
    },

    decorators: [
        (Story) => (
            <Provider store={reduxStore}>
                <Router>
                    <BugConfirmDialogProvider>
                        <BugCustomDialogProvider>
                            <BugRenameDialogProvider>
                                <StyledEngineProvider injectFirst>
                                    <ThemeProvider theme={appTheme}>
                                        <MUIThemeProvider theme={appTheme}>
                                            <div
                                                style={{
                                                    backgroundColor: "#181818",
                                                    color: "#ffffff",
                                                    fontFamily: "Roboto",
                                                    fontSize: "14px",
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                <Story />
                                            </div>
                                        </MUIThemeProvider>
                                    </ThemeProvider>
                                </StyledEngineProvider>
                            </BugRenameDialogProvider>
                        </BugCustomDialogProvider>
                    </BugConfirmDialogProvider>
                </Router>
            </Provider>
        ),
    ],
};

export default preview;