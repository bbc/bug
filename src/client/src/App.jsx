import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import AuthRouter from "@components/AuthRouter";
import theme from "./theme";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import Fade from "@material-ui/core/Fade";
import { SnackbarConfigurator } from "@utils/Snackbar";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { BugConfirmDialogProvider } from "@core/BugConfirmDialog";
import DateFnsUtils from "@date-io/date-fns";
import PanelListHandler from "@data/PanelListHandler";
import UserHandler from "@data/UserHandler";
import StrategiesHandler from "@data/StrategiesHandler";
import { ModalProvider } from "react-modal-hook";
import { Provider } from "react-redux";
import reduxStore from "@redux/store";

export default function App() {
    return (
        <>
            <Provider store={reduxStore}>
                <ThemeProvider theme={theme}>
                    <BugConfirmDialogProvider>
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
                                <UserHandler />
                                <StrategiesHandler />
                                <PanelListHandler />
                                <ModalProvider>
                                    <AuthRouter />
                                </ModalProvider>
                            </SnackbarProvider>
                        </MuiPickersUtilsProvider>
                    </BugConfirmDialogProvider>
                </ThemeProvider>
            </Provider>
        </>
    );
}
