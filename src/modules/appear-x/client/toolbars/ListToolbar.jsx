import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useSelector } from "react-redux";
import LaunchIcon from "@mui/icons-material/Launch";

export default function Toolbar({ panelId, ...props }) {
    let toolbarProps = { ...props };
    const panelConfig = useSelector((state) => state.panelConfig);

    const handleLaunchClicked = async (event, item) => {
        if (panelConfig?.data?.address) {
            const url = `https://${panelConfig.data.address}`;
            const newWindow = window.open(url, "_blank", "noopener,noreferrer");
            if (newWindow) newWindow.opener = null;
        }
    };

    toolbarProps["buttons"] = null;
    toolbarProps["menuItems"] = [
        <MenuItem key="launch" onClick={handleLaunchClicked}>
            <ListItemIcon>
                <LaunchIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Launch device webpage" />
        </MenuItem>,
    ];
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
