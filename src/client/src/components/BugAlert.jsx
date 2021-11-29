import React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import ReplayIcon from "@mui/icons-material/Replay";
import SettingsIcon from "@mui/icons-material/Settings";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useHistory } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)({
    borderColor: "#ccc",
    color: "#ccc",
    backgroundColor: alpha("#000000", 0.2),
    "&:hover": {
        backgroundColor: alpha("#000000", 0.3),
    },
    marginRight: "1rem",
});

export default function BugAlert({ type, message, flags = [], panel, square = false, width = null }) {
    const history = useHistory();
    const sendAlert = useAlert();

    const titles = {
        critical: "Critical Error",
        warning: "Warning",
        info: "Info",
        error: "Error",
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
        history.push(`/panel/${panel.id}/config`);
    };

    const handleRestart = async (event) => {
        sendAlert(`Restarting panel: ${panel.title} - please wait ...`, { broadcast: true, variant: "info" });
        if (await AxiosCommand(`/api/panel/restart/${panel.id}`)) {
            sendAlert(`Restarted panel: ${panel.title}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to restart panel: ${panel.title}`, { variant: "error" });
        }
    };

    return (
        <Alert
            sx={{
                width: width === null ? "auto" : width,
                borderRadius: square ? "0px" : "4px",
                "& .MuiAlert-message": {
                    paddingRight: "4px",
                },
            }}
            severity={mappedSeverity[type]}
        >
            <AlertTitle>{titles[type]}</AlertTitle>
            {renderMessage()}
            {renderControls()}
        </Alert>
    );
}
