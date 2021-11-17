import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useApiPoller } from "@utils/ApiPoller";
import SaveIcon from "@mui/icons-material/Save";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import BugApiSaveButton from "@core/BugApiSaveButton";
import LaunchIcon from "@mui/icons-material/Launch";
import Divider from "@mui/material/Divider";

export default function Toolbar(props) {
    const sendAlert = useAlert();
    const pending = useApiPoller({
        url: `/container/${props.panelId}/pending/`,
        interval: 1000,
    });

    const isPending = pending.status === "success" && pending.data;

    const handleSave = async (event, item) => {
        sendAlert("Saving device config ... please wait", {
            variant: "info",
        });
        if (await AxiosCommand(`/container/${props.panelId}/device/save`)) {
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
            <BugApiSaveButton
                disabled={!isPending}
                variant="outlined"
                color={isPending ? "warning" : "primary"}
                onClick={handleSave}
            >
                Save
            </BugApiSaveButton>
        </>
    );

    const menuItems = () => {
        return [
            <MenuItem key="save" disabled={!isPending} onClick={handleSave}>
                <ListItemIcon>
                    <SaveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Save Changes" />
            </MenuItem>,
            <Divider key="divider" />,
            <MenuItem key="launch" onClick={handleSave}>
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
    return <BugToolbarWrapper {...toolbarProps} isClosed={false} />;
}
