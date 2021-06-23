import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { fade } from "@material-ui/core/styles/colorManipulator";
import ReplayIcon from "@material-ui/icons/Replay";
import SettingsIcon from "@material-ui/icons/Settings";
import { Redirect } from "react-router";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";

const useStyles = makeStyles((theme) => ({
    alert: {
        borderRadius: 0,
    },
    multiMessage: {
        marginTop: 2,
        marginBottom: 2,
    },
    button: {
        borderColor: "#ccc",
        color: "#ccc",
        backgroundColor: fade("#000000", 0.2),
        "&:hover": {
            backgroundColor: fade("#000000", 0.3),
        },
        marginRight: "1rem",
    },
    controls: {
        marginTop: 14,
        marginBottom: 2,
        textAlign: "right",
        whiteSpace: "nowrap",
    },
}));

export default function BugAlert({ type, message, flags = [], panel }) {
    const classes = useStyles();
    const [redirectUrl, setRedirectUrl] = React.useState(null);
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
        setRedirectUrl(`/panel/${panel.id}/config`);
    };

    const handleRestart = async (event) => {
        sendAlert(`Restarting panel: ${panel.title} - please wait ...`, { broadcast: true, variant: "info" });
        if (await AxiosCommand(`/api/panel/restart/${panel.id}`)) {
            sendAlert(`Restarted panel: ${panel.title}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to restart panel: ${panel.title}`, { variant: "error" });
        }
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <Alert severity={mappedSeverity[type]} className={classes.alert}>
            <AlertTitle className={classes.title}>{titles[type]}</AlertTitle>
            {renderMessage()}
            {renderControls()}
        </Alert>
    );
}
