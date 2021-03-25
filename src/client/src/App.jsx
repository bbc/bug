import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Page from "@pages/Page";
import theme from "./theme";
import PanelList from "@data/PanelList";
import { ThemeProvider } from "@material-ui/core/styles";

export default function App() {
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <PanelList>
                    <Page></Page>
                </PanelList>
            </ThemeProvider>
        </>
    );
}
