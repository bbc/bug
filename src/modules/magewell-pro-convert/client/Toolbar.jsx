import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AxiosCommand from "@utils/AxiosCommand";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useAlert } from "@utils/Snackbar";
import { usePanelStatus } from "@hooks/PanelStatus";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function Toolbar(props) {
    let toolbarProps = { ...props };
    const panelStatus = usePanelStatus();
    const panelConfig = useSelector((state) => state.panelConfig);
    const sendAlert = useAlert();

    toolbarProps["onClick"] = null;

    const handleReboot = async (event) => {
        sendAlert(`Rebooting ${panelConfig.data.name}, please wait ...`, { broadcast: true, variant: "info" });
        if (await AxiosCommand(`/container/${props?.panelId}/device/reboot`)) {
            sendAlert(`Restarted ${panelConfig.data.name}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to reboot ${panelConfig.data.name}`, { variant: "error" });
        }
    };

    const handleWebpageClicked = async (event) => {
        const url = `http://${panelConfig.data.address}`;
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

    const menuItems = () => [
        <>
            <MenuItem onClick={handleWebpageClicked}>
                <ListItemIcon>
                    <OpenInNewIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Goto Webpage" />
            </MenuItem>
        </>,
        <>
            <MenuItem onClick={handleReboot}>
                <ListItemIcon>
                    <PowerSettingsNewIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Reboot Device" />
            </MenuItem>
        </>,
    ];

    const buttons = () => [
        <>
            <Tooltip title="Goto Webpage">
                <IconButton
                    sx={{
                        "& .MuiButton-startIcon": {
                            margin: 0,
                        },
                        marginRight: 1,
                    }}
                    component={Link}
                    onClick={handleWebpageClicked}
                    variant="outlined"
                    color="default"
                >
                    <OpenInNewIcon />
                </IconButton>
            </Tooltip>
        </>,
        <>
            <Tooltip title="Reboot Device">
                <IconButton
                    sx={{
                        "& .MuiButton-startIcon": {
                            margin: 0,
                        },
                        marginRight: 1,
                    }}
                    component={Link}
                    onClick={handleReboot}
                    variant="outlined"
                    color="default"
                >
                    <PowerSettingsNewIcon />
                </IconButton>
            </Tooltip>
        </>,
    ];

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = panelStatus.hasCritical ? null : menuItems();

    return <BugToolbarWrapper {...toolbarProps} isClosed={false} />;
}
