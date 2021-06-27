import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import PageRouter from "@components/pages/PageRouter";
import theme from "./theme";
import PanelList from "@data/PanelList";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import Fade from "@material-ui/core/Fade";
import { SnackbarConfigurator } from "@utils/Snackbar";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import User from "@data/User";

import { Provider } from "react-redux";
import reduxStore from "@redux/store";

export default function App() {
    return (
        <>
            <Provider store={reduxStore}>
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
                            <User>
                                <PanelList>
                                    <PageRouter></PageRouter>
                                </PanelList>
                            </User>
                        </SnackbarProvider>
                    </MuiPickersUtilsProvider>
                </ThemeProvider>
            </Provider>
        </>
    );
}
