import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import ReplayIcon from "@mui/icons-material/Replay";
import SettingsIcon from "@mui/icons-material/Settings";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import clsx from "clsx";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    multiMessage: {
        marginTop: 2,
        marginBottom: 2,
    },
    button: {
        borderColor: "#ccc",
        color: "#ccc",
        backgroundColor: alpha("#000000", 0.2),
        "&:hover": {
            backgroundColor: alpha("#000000", 0.3),
        },
        marginRight: "1rem",
    },
    controls: {
        marginTop: 14,
        marginBottom: 2,
        textAlign: "right",
        whiteSpace: "nowrap",
    },
    squareCorners: {
        borderRadius: 0,
    },
}));

export default function BugAlert({ type, message, flags = [], panel, square = false, width = null }) {
    const classes = useStyles();
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
                <div key={index} className={classes.multiMessage}>
                    {eachMessage}
                </div>
            ));
        }
        return message;
    };

    const renderControls = () => {
        let controls = [];
        if (flags.includes("restartPanel")) {
            controls.push(
                <Button
                    key="restart"
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                    disableElevation
                    onClick={handleRestart}
                    startIcon={<ReplayIcon />}
                >
                    Restart Panel
                </Button>
            );
        }
        if (flags.includes("configurePanel")) {
            controls.push(
                <Button
                    key="configure"
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                    disableElevation
                    onClick={handleConfig}
                    startIcon={<SettingsIcon />}
                >
                    Configure
                </Button>
            );
        }

        if (controls.length > 0) {
            return <div className={classes.controls}>{controls.map((control) => control)}</div>;
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
            }}
            severity={mappedSeverity[type]}
            className={clsx({
                [classes.squareCorners]: square,
            })}
        >
            <AlertTitle className={classes.title}>{titles[type]}</AlertTitle>
            {renderMessage()}
            {renderControls()}
        </Alert>
    );
}
