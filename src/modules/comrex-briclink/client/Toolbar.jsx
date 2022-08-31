import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LaunchIcon from "@mui/icons-material/Launch";
import Divider from "@mui/material/Divider";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default function Toolbar({ panelId, ...props }) {
    const panelConfig = useSelector((state) => state.panelConfig);
    const location = useLocation();

    const isOnConnectionsPage = location.pathname.indexOf("connections") > -1;

    const handleLaunchClicked = async (event, item) => {
        if (panelConfig?.data?.address) {
            const url = `http://${panelConfig.data.address}`;
            const newWindow = window.open(url, "_blank", "noopener,noreferrer");
            if (newWindow) newWindow.opener = null;
        }
    };

    let toolbarProps = { ...props };

    const buttons = () => {
        if (isOnConnectionsPage) {
            return (
                <Button
                    component={Link}
                    to={`/panel/${panelId}/connection`}
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Add
                </Button>
            );
        }
        return null;
    };

    const menuItems = () => {
        return [
            <Divider key="divider1" />,
            isOnConnectionsPage && (
                <MenuItem key="add" component={Link} to={`/panel/${panelId}/connection`}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Add Connection" />
                </MenuItem>
            ),
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
