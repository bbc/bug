import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Page from "@pages/Page";
import theme from "./theme";
import PanelList from "@data/PanelList";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import Fade from "@material-ui/core/Fade";
import { SnackbarConfigurator } from "@utils/Snackbar";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export default function App() {
    return (
        <>
            <ThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <SnackbarProvider
                        dense
                        autoHideDuration={3000}
                        preventDuplicate
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        TransitionComponent={Fade}
                        maxSnack={3}
                    >
                        <SnackbarConfigurator />
                        <CssBaseline />
                        <PanelList>
                            <Page></Page>
                        </PanelList>
                    </SnackbarProvider>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </>
    );
}
