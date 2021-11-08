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
import Button from "@mui/material/Button";
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
            <MenuItem onClick={handleReboot}>
                <ListItemIcon>
                    <PowerSettingsNewIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Reboot Device" />
            </MenuItem>
        </>,
    ];

    const buttons = () => (
        <>
            <Button
                component={Link}
                onClick={handleWebpageClicked}
                variant="outlined"
                color="primary"
                startIcon={<OpenInNewIcon />}
            >
                Goto
            </Button>
        </>
    );

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = panelStatus.hasCritical ? null : menuItems();

    return <BugToolbarWrapper {...toolbarProps} isClosed={false} />;
}
