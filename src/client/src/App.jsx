import AuthRouter from "@components/AuthRouter";
import { BugConfirmDialogProvider } from "@core/BugConfirmDialog";
import { BugCustomDialogProvider } from "@core/BugCustomDialog";
import { BugRenameDialogProvider } from "@core/BugRenameDialog";
import PanelListHandler from "@data/PanelListHandler";
import SettingsHandler from "@data/SettingsHandler";
import StrategiesHandler from "@data/StrategiesHandler";
import UserHandler from "@data/UserHandler";
import { CssBaseline, Fade } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/styled-engine";
import reduxStore from "@redux/store";
import { SnackbarConfigurator } from "@utils/Snackbar";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { SnackbarProvider } from "notistack";
import { ModalProvider } from "react-modal-hook";
import { Provider, useSelector } from "react-redux";
import theme from "./theme";
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
        <Provider store={reduxStore}>
            <StyledEngineProvider injectFirst>
                <ThemedApp />
            </StyledEngineProvider>
        </Provider>
    );
}
