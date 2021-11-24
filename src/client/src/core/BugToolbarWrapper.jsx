import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Hidden } from "@material-ui/core";
import BadgeWrapper from "@components/BadgeWrapper";
import PanelStatus from "@components/panels/PanelStatus";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useSelector } from "react-redux";
import Popover from "@mui/material/Popover";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import PanelDeleteDialog from "@components/panels/PanelDeleteDialog";
import ReplayIcon from "@mui/icons-material/Replay";
import { useHistory } from "react-router-dom";

/*
 * this has optional properties:
 * - buttons - which can take buttons with links to show on the toolbar
 * - menuitems - which can take menuitems which will be shown in the list
 */

export default function PanelToolbar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const panel = useSelector((state) => state.panel);
    const [statusEl, setStatusEl] = React.useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const statusOpen = Boolean(statusEl);
    const hasCritical = panel.data._status && panel.data._status.filter((x) => x.type === "critical").length > 0;
    const statusItemCount = panel.data._status ? panel.data._status.length : 0;
    const sendAlert = useAlert();
    const history = useHistory();

    useEffect(() => {
        // if the number if status items changes, and it's now 0, hide the popup
        if (statusItemCount === 0) {
            setStatusEl(null);
        }
    }, [statusItemCount]);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStatusClick = (event) => {
        setStatusEl(event.currentTarget);
    };

    const handleStatusClose = () => {
        setStatusEl(null);
    };

    const handleDisable = async () => {
        setStatusEl(null);
        if (await AxiosCommand(`/api/panel/disable/${panel.data.id}`)) {
            sendAlert(`Disabled panel: ${panel.data.title}`, {
                broadcast: true,
                variant: "success",
            });
            history.push("/");
        } else {
            sendAlert(`Failed to disable panel: ${panel.data.title}`, {
                variant: "error",
            });
        }
    };

    const handleRestart = async () => {
        sendAlert(`Restarting panel: ${panel.data.title} - please wait ...`, {
            broadcast: true,
            variant: "info",
        });
        setAnchorEl(null);
        if (await AxiosCommand(`/api/panel/restart/${panel.data.id}`)) {
            sendAlert(`Restarted panel: ${panel.data.title}`, {
                broadcast: true,
                variant: "success",
            });
        } else {
            sendAlert(`Failed to restart panel: ${panel.data.title}`, {
                variant: "error",
            });
        }
    };

    const handleDelete = () => {
        setAnchorEl(null);
        setDeleteDialogOpen(true);
    };

    if (panel.status === "loading") {
        return null;
    }
    if (panel.status === "success") {
        return (
            <>
                {hasCritical || panel.data._status?.length === 0 ? null : (
                    <>
                        <Popover
                            open={statusOpen}
                            anchorEl={statusEl}
                            onClose={handleStatusClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                        >
                            <PanelStatus statusItems={panel.data._status} panel={panel.data} />
                        </Popover>

                        <IconButton
                            sx={{
                                "& .MuiButton-startIcon": {
                                    margin: 0,
                                },
                                marginRight: "8px",
                            }}
                            color="default"
                            onClick={handleStatusClick}
                        >
                            <BadgeWrapper
                                panel={panel.data}
                                position={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                            >
                                <NotificationsIcon />
                            </BadgeWrapper>
                        </IconButton>
                    </>
                )}
                <Hidden xsDown>{props.buttons ? props.buttons : null}</Hidden>
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
                    <MenuItem component={Link} to={`/panel/${panel.data.id}/config`}>
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Config" />
                    </MenuItem>
                    {props.menuItems}
                    <Divider />
                    <MenuItem disabled>
                        <ListItemIcon>
                            <ToggleOnIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Enable Panel" />
                    </MenuItem>
                    <MenuItem onClick={handleDisable}>
                        <ListItemIcon>
                            <ToggleOffIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Disable Panel" />
                    </MenuItem>
                    <MenuItem onClick={handleRestart}>
                        <ListItemIcon>
                            <ReplayIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Restart Panel" />
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Delete Panel" />
                    </MenuItem>
                </Menu>
                {deleteDialogOpen ? (
                    <PanelDeleteDialog
                        panelId={panel.data.id}
                        panelTitle={panel.data.title}
                        onClose={() => setDeleteDialogOpen(false)}
                    />
                ) : null}
            </>
        );
    }
    return null;
}
