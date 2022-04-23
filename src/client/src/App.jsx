import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AuthRouter from "@components/AuthRouter";
import theme from "./theme";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { useSelector } from "react-redux";
import Fade from "@mui/material/Fade";
import { SnackbarConfigurator } from "@utils/Snackbar";
import { BugConfirmDialogProvider } from "@core/BugConfirmDialog";
import { BugRenameDialogProvider } from "@core/BugRenameDialog";
import { BugCustomDialogProvider } from "@core/BugCustomDialog";
import PanelListHandler from "@data/PanelListHandler";
import UserHandler from "@data/UserHandler";
import SettingsHandler from "@data/SettingsHandler";
import StrategiesHandler from "@data/StrategiesHandler";
import { ModalProvider } from "react-modal-hook";
import { Provider } from "react-redux";
import reduxStore from "@redux/store";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);

const ThemedApp = (props) => {
    const selectedTheme = useSelector((state) => {
        return state.settings?.data?.theme;
    });

    return (
        <ThemeProvider theme={theme(selectedTheme)}>
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
                            <SettingsHandler />
                            <PanelListHandler />
                            <ModalProvider>
                                <AuthRouter />
                            </ModalProvider>
                        </SnackbarProvider>
                    </BugCustomDialogProvider>
                </BugRenameDialogProvider>
            </BugConfirmDialogProvider>
        </ThemeProvider>
    );
};
export default function App() {
    return (
        <>
            <Provider store={reduxStore}>
                <StyledEngineProvider injectFirst>
                    <ThemedApp />
                </StyledEngineProvider>
            </Provider>
        </>
    );
}
