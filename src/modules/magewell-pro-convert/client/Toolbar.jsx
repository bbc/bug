import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AxiosCommand from "@utils/AxiosCommand";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useAlert } from "@utils/Snackbar";
import { usePanelStatus } from "@hooks/PanelStatus";

export default function Toolbar(props) {
    let toolbarProps = { ...props };
    const panelStatus = usePanelStatus();
    const sendAlert = useAlert();

    toolbarProps["onClick"] = null;

    const handleReboot = async (event) => {
        sendAlert(`Rebooting Magewell, please wait ...`, { broadcast: true, variant: "info" });
        if (await AxiosCommand(`/container/${props?.panelId}/device/reboot`)) {
            sendAlert(`Restarted Magewell`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to reboot Magewell`, { variant: "error" });
        }
    };

    const menuItems = () => [
        <>
            <MenuItem onClick={handleReboot}>
                <ListItemIcon>
                    <PowerSettingsNewIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Reboot Device" />
            </MenuItem>
        </>,
    ];

    toolbarProps["menuItems"] = panelStatus.hasCritical ? null : menuItems();

    return <BugToolbarWrapper {...toolbarProps} isClosed={false} />;
}
