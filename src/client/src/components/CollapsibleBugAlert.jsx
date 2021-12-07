import React from "react";
import Alert from "@mui/material/Alert";
import ReplayIcon from "@mui/icons-material/Replay";
import SettingsIcon from "@mui/icons-material/Settings";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useHistory } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

export default function CollapsibleBugAlert({ type, message, flags = [], panel, square = false }) {
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
                <Box
                    sx={{
                        minWidth: 0,
                    }}
                >
                    {message.map((eachMessage, index) => (
                        <Box
                            key={index}
                            sx={{
                                marginTop: "14px",
                                marginBottom: "14px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                minWidth: 0,
                            }}
                        >
                            {eachMessage}
                        </Box>
                    ))}
                </Box>
            );
        }
        return message;
    };

    const FirstLine = () => (
        <Box
            sx={{
                marginTop: "14px",
                marginBottom: "14px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}
        >
            {Array.isArray(message) ? message[0] : message}
        </Box>
    );

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
            return (
                <Box sx={{ marginTop: "4px", marginBottom: "4px", textAlign: "right", whiteSpace: "nowrap" }}>
                    {controls.map((control) => control)}
                </Box>
            );
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
        <Alert
            severity={mappedSeverity[type]}
            sx={{
                borderRadius: "0px",
                "& .MuiAlert-message": {
                    padding: "0px",
                    flexGrow: 1,
                    width: "100%",
                },
                padding: "0px",
                "& .MuiAlert-icon": {
                    display: "none",
                    // padding: 10,
                    // marginRight: 4,
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    paddingLeft: "14px",
                }}
            >
                {open ? <AllMessages /> : <FirstLine />}
                {(hasMultipleLines() || hasFlags()) && (
                    <IconButton
                        sx={{
                            marginLeft: "auto",
                            transitionProperty: "transform",
                            transitionDuration: "0.3s",
                            transitionTimingFunction: "ease-in-out",
                            transitionDelay: "0s",
                            height: "48px",
                            transform: open ? "rotate(180deg)" : "none",
                        }}
                        onClick={handleOpenClick}
                        aria-expanded={open}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                )}
            </Box>
            {open && <Controls />}
        </Alert>
    );
}
