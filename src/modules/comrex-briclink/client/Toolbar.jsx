import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LaunchIcon from "@mui/icons-material/Launch";
import Divider from "@mui/material/Divider";
import { useSelector } from "react-redux";

export default function Toolbar({ panelId, ...props }) {
    const panelConfig = useSelector((state) => state.panelConfig);
    const panel = useSelector((state) => state.panel);

    const handleLaunchClicked = async (event, item) => {
        if (panelConfig?.data?.address) {
            const url = `http://${panelConfig.data.address}`;
            const newWindow = window.open(url, "_blank", "noopener,noreferrer");
            if (newWindow) newWindow.opener = null;
        }
    };

    let toolbarProps = { ...props };

    const buttons = () => <></>;

    const menuItems = () => {
        return [
            <Divider key="divider1" />,
            <MenuItem key="launch" onClick={handleLaunchClicked}>
                <ListItemIcon>
                    <LaunchIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Launch device webpage" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} />;
}
