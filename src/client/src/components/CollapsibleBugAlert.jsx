import React from "react";
import Alert from "@mui/material/Alert";
import { makeStyles } from "@mui/styles";
import ReplayIcon from "@mui/icons-material/Replay";
import SettingsIcon from "@mui/icons-material/Settings";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";

const useStyles = makeStyles((theme) => ({
    multiMessage: {
        marginTop: 14,
        marginBottom: 2,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    firstLineMessage: {
        marginTop: 14,
        marginBottom: 14,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    button: {
        borderColor: "#ccc",
        color: "#ccc",
        backgroundColor: "inherit",
        marginRight: "1rem",
    },
    controls: {
        marginTop: 4,
        marginBottom: 4,
        textAlign: "right",
        whiteSpace: "nowrap",
    },
    alert: {
        borderRadius: 0,
        "& .MuiAlert-message": {
            padding: 0,
            flexGrow: 1,
            width: "100%",
        },
        padding: 0,
        "& .MuiAlert-icon": {
            display: "none",
            // padding: 10,
            // marginRight: 4,
        },
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
        height: 48,
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    multiMessages: {
        minWidth: 0,
    },
    columns: {
        display: "flex",
        flexDirection: "rows",
        width: "100%",
        paddingLeft: 14,
    },
}));

export default function CollapsibleBugAlert({ type, message, flags = [], panel, square = false }) {
    const classes = useStyles();
    const history = useHistory();
    const sendAlert = useAlert();
    const [open, setOpen] = React.useState(false);

    const handleOpenClick = (event) => {
        setOpen(!open);
        event.stopPropagation();
        event.preventDefault();
    };

    const mappedSeverity = {
        critical: "error",
        warning: "warning",
        info: "info",
        error: "error",
    };

    const AllMessages = () => {
        if (Array.isArray(message)) {
            return (
                <div className={classes.multiMessages}>
                    {message.map((eachMessage, index) => (
                        <div key={index} className={classes.multiMessage}>
                            {eachMessage}
                        </div>
                    ))}
                </div>
            );
        }
        return message;
    };

    const FirstLine = () => {
        if (Array.isArray(message)) {
            return <div className={classes.firstLineMessage}>{message[0]}</div>;
        }
        return <div className={classes.firstLineMessage}>{message}</div>;
    };

    const hasMultipleLines = () => {
        return Array.isArray(message) && message.length > 1;
    };

    const hasFlags = () => {
        return Array.isArray(flags) && flags.length > 0;
    };

    const Controls = () => {
        let controls = [];
        if (flags.includes("restartPanel")) {
            controls.push(
                <IconButton key="restart" onClick={handleRestart}>
                    <ReplayIcon />
                </IconButton>
            );
        }
        if (flags.includes("configurePanel")) {
            controls.push(
                <IconButton key="configure" onClick={handleConfig}>
                    <SettingsIcon />
                </IconButton>
            );
        }
        if (controls.length > 0) {
            return <div className={classes.controls}>{controls.map((control) => control)}</div>;
        }
        return null;
    };

    const handleConfig = (event) => {
        history.push(`/panel/${panel.id}/config`);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleRestart = async (event) => {
        sendAlert(`Restarting panel: ${panel.title} - please wait ...`, { broadcast: true, variant: "info" });
        if (await AxiosCommand(`/api/panel/restart/${panel.id}`)) {
            sendAlert(`Restarted panel: ${panel.title}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to restart panel: ${panel.title}`, { variant: "error" });
        }
        event.stopPropagation();
        event.preventDefault();
    };

    return (
        <Alert severity={mappedSeverity[type]} className={classes.alert}>
            <div className={classes.columns}>
                {open ? <AllMessages /> : <FirstLine />}
                {(hasMultipleLines() || hasFlags()) && (
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: open,
                        })}
                        onClick={handleOpenClick}
                        aria-expanded={open}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                )}
            </div>
            {open && <Controls />}
        </Alert>
    );
}
