import React from "react";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AxiosGet from "@utils/AxiosGet";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { useAlert } from "@utils/Snackbar";
import BugRestrictTo from "@core/BugRestrictTo";

export default function SystemToolbar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const sendAlert = useAlert();

    const handleShutdown = async () => {
        sendAlert(`Application shutting down`, { broadcast: "true", variant: "success" });
        AxiosGet("/api/bug/shutdown");
    };

    const handleRestart = async () => {
        sendAlert(`Application restarting`, { broadcast: "true", variant: "success" });
        AxiosGet("/api/bug/restart");
    };

    const handleCleanup = async () => {
        sendAlert(`Cleaning up system`, { broadcast: "true", variant: "success" });

        const status = await AxiosGet("/api/system/cleanup");
        if (status) {
            sendAlert(`Cleanup successful`, { broadcast: "true", variant: "success" });
        }
    };

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <BugRestrictTo role="admin">
                <IconButton
                    sx={{
                        marginLeft: "0.5rem",
                        marginRight: "0.5rem",
                    }}
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleOpenMenuClick}
                >
                    <MoreIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
                    <MenuItem onClick={handleRestart}>
                        <ListItemIcon>
                            <RestartAltIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Restart" />
                    </MenuItem>
                    <MenuItem onClick={handleShutdown}>
                        <ListItemIcon>
                            <PowerSettingsNewIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Shutdown" />
                    </MenuItem>
                    <MenuItem onClick={handleCleanup}>
                        <ListItemIcon>
                            <CleaningServicesIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Cleanup" />
                    </MenuItem>
                </Menu>
            </BugRestrictTo>
        </>
    );
}
