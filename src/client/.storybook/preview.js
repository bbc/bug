import { ThemeProvider as MUIThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "emotion-theming";
import theme from "../src/theme";
import { Provider } from "react-redux";
import reduxStore from "@redux/store";

export const decorators = [
    (Story) => (
        <Provider store={reduxStore}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <>
                        <Story />
                    </>
                </ThemeProvider>
            </StyledEngineProvider>
        </Provider>
    ),

    (Story) => (
        <>
            <body
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
            </body>
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
    controls: { expanded: true },
};
