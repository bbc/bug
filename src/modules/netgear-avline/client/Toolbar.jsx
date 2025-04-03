import BugApiButton from "@core/BugApiButton";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import LaunchIcon from "@mui/icons-material/Launch";
import SaveIcon from "@mui/icons-material/Save";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useSelector } from "react-redux";

export default function Toolbar({ panelId, ...props }) {
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);

    const handleLaunchClicked = async (event, item) => {
        if (panelConfig?.data?.address) {
            const url = `http://${panelConfig.data.address}`;
            const newWindow = window.open(url, "_blank", "noopener,noreferrer");
            if (newWindow) newWindow.opener = null;
        }
    };

    const handleSave = async (event, item) => {
        sendAlert("Saving device config ... please wait", {
            variant: "info",
        });
        if (await AxiosCommand(`/container/${panelId}/device/save`)) {
            sendAlert("Saved device config", {
                broadcast: true,
                variant: "success",
            });
        } else {
            sendAlert("Failed to save device config", {
                variant: "error",
            });
        }
    };

    let toolbarProps = { ...props };

    const buttons = () => (
        <>
            <BugApiButton variant="outlined" onClick={handleSave} timeout={1000} icon={<SaveIcon />}>
                Save
            </BugApiButton>
        </>
    );

    const menuItems = () => {
        return [
            <MenuItem key="save" onClick={handleSave}>
                <ListItemIcon>
                    <SaveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Save Changes" />
            </MenuItem>,
            <Divider key="divider" />,
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
