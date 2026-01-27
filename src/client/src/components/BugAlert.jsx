import ReplayIcon from "@mui/icons-material/Replay";
import SettingsIcon from "@mui/icons-material/Settings";
import TerminalIcon from "@mui/icons-material/Terminal";
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useNavigate } from "react-router-dom";

const StyledButton = styled(Button)({
    borderColor: "#ccc",
    color: "#ccc",
    backgroundColor: alpha("#000000", 0.2),
    "&:hover": {
        backgroundColor: alpha("#000000", 0.3),
    },
    marginRight: "1rem",
});

export default function BugAlert({
    title = null,
    type,
    message,
    flags = [],
    panel,
    square = false,
    width = null,
    sx = {},
}) {
    const navigate = useNavigate();
    const sendAlert = useAlert();

    const titles = {
        critical: "Critical Error",
        warning: "Warning",
        info: "Info",
        error: "Error",
        success: "Status",
    };

    const mappedSeverity = {
        critical: "error",
        warning: "warning",
        info: "info",
        error: "error",
    };

    const renderMessage = () => {
        if (Array.isArray(message)) {
            return message.map((eachMessage, index) => (
                <Box
                    key={index}
                    sx={{
                        marginTop: "2px",
                        marginBottom: "2px",
                    }}
                >
                    {eachMessage}
                </Box>
            ));
        }
        return message;
    };

    const renderControls = () => {
        let controls = [];
        if (flags.includes("restartPanel")) {
            controls.push(
                <StyledButton
                    key="restart"
                    variant="contained"
                    color="secondary"
                    disableElevation
                    onClick={handleRestart}
                    startIcon={<ReplayIcon />}
                >
                    Restart Panel
                </StyledButton>
            );
        }
        if (flags.includes("configurePanel")) {
            controls.push(
                <StyledButton
                    key="configure"
                    variant="contained"
                    color="secondary"
                    disableElevation
                    onClick={handleConfig}
                    startIcon={<SettingsIcon />}
                >
                    Configure
                </StyledButton>
            );
        }
        if (flags.includes("viewPanelLogs")) {
            controls.push(
                <StyledButton
                    key="logs"
                    variant="contained"
                    color="secondary"
                    disableElevation
                    onClick={handleLogs}
                    startIcon={<TerminalIcon />}
                >
                    View Logs
                </StyledButton>
            );
        }

        if (controls.length > 0) {
            return (
                <Box
                    sx={{
                        marginTop: "14px",
                        marginBottom: "2px",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                    }}
                >
                    {controls.map((control) => control)}
                </Box>
            );
        }
        return null;
    };

    const handleConfig = (event) => {
        navigate(`/panel/${panel.id}/config`);
    };

    const handleRestart = async (event) => {
        sendAlert(`Restarting panel: ${panel.title} - please wait ...`, { broadcast: "true", variant: "info" });
        if (await AxiosCommand(`/api/panel/restart/${panel.id}`)) {
            sendAlert(`Restarted panel: ${panel.title}`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`Failed to restart panel: ${panel.title}`, { variant: "error" });
        }
    };

    const handleLogs = (event) => {
        navigate(`/system/logs/${panel.id}`);
    };

    return (
        <Alert
            sx={{
                width: width === null ? "auto" : width,
                borderRadius: square ? "0px" : "4px",
                "& .MuiAlert-message": {
                    paddingRight: "4px",
                },
                ...sx,
            }}
            severity={mappedSeverity[type]}
        >
            <AlertTitle>{title ? title : titles[type]}</AlertTitle>
            {renderMessage()}
            {renderControls()}
        </Alert>
    );
}
