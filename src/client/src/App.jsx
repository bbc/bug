import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AuthRouter from "@components/AuthRouter";
import theme from "./theme";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import Fade from "@mui/material/Fade";
import { SnackbarConfigurator } from "@utils/Snackbar";
import { BugConfirmDialogProvider } from "@core/BugConfirmDialog";
import { BugRenameDialogProvider } from "@core/BugRenameDialog";
import { BugCustomDialogProvider } from "@core/BugCustomDialog";
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
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <BugConfirmDialogProvider>
                            <BugRenameDialogProvider>
                                <BugCustomDialogProvider>
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
                                </BugCustomDialogProvider>
                            </BugRenameDialogProvider>
                        </BugConfirmDialogProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </Provider>
        </>
    );
}
