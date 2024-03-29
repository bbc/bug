import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useApiPoller } from "@hooks/ApiPoller";
import SaveIcon from "@mui/icons-material/Save";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import BugApiButton from "@core/BugApiButton";
import LaunchIcon from "@mui/icons-material/Launch";
import Divider from "@mui/material/Divider";
import { useSelector } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import AxiosPut from "@utils/AxiosPut";
import UndoIcon from "@mui/icons-material/Undo";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { usePanelToolbarEventTrigger } from "@hooks/PanelToolbarEvent";

export default function Toolbar({ panelId, ...props }) {
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const panel = useSelector((state) => state.panel);
    const params = useParams();
    const history = useHistory();
    const triggerPanelEvent = usePanelToolbarEventTrigger();

    const pending = useApiPoller({
        url: `/container/${panelId}/localdata/checkpending/${encodeURIComponent(params.serviceId)}`,
        interval: 1000,
    });

    const isPending = pending.status === "success" && pending.data;
    const hasCritical = panel.data._status && panel.data._status.filter((x) => x.type === "critical").length > 0;

    const handleLaunchClicked = async (event, item) => {
        if (panelConfig?.data?.address) {
            const url = `https://${panelConfig.data.address}`;
            const newWindow = window.open(url, "_blank", "noopener,noreferrer");
            if (newWindow) newWindow.opener = null;
        }
    };

    const handleCancelClicked = async (event, item) => {
        if (await AxiosCommand(`/container/${panelId}/localdata/revert/${encodeURIComponent(params.serviceId)}`)) {
            triggerPanelEvent("refresh");
        } else {
            sendAlert("Failed to revert service config", {
                variant: "error",
            });
        }
    };

    const handleSaveClicked = async (event, item) => {
        sendAlert("Saving service config ... please wait", {
            variant: "info",
        });
        if (
            await AxiosCommand(`/container/${panelId}/mpegencoderservice/save/${encodeURIComponent(params.serviceId)}`)
        ) {
            triggerPanelEvent("refresh");
            sendAlert("Saved service config", {
                broadcast: "true",
                variant: "success",
            });
        } else {
            sendAlert("Failed to save service config", {
                variant: "error",
            });
        }
    };

    const handleShowAdvancedClicked = async (event, item) => {
        await AxiosPut(`/api/panelconfig/${panelId}`, {
            showAdvanced: !panelConfig?.data?.showAdvanced,
        });
    };

    let toolbarProps = { ...props };

    const buttons = () => (
        <>
            <BugApiButton
                key="save_button"
                disabled={!isPending || hasCritical}
                variant="outlined"
                color={isPending ? "warning" : "primary"}
                onClick={handleSaveClicked}
                timeout={5000}
                icon={<SaveIcon />}
            >
                Save
            </BugApiButton>
            <Button
                key="cancel_button"
                disabled={!isPending || hasCritical}
                variant="outlined"
                color="primary"
                onClick={handleCancelClicked}
            >
                Cancel
            </Button>
        </>
    );

    const menuItems = () => {
        return [
            <Divider key="divider1" />,
            <MenuItem key="save" disabled={!isPending} onClick={handleSaveClicked}>
                <ListItemIcon>
                    <SaveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Save Changes" />
            </MenuItem>,
            <MenuItem key="cancel" disabled={!isPending} onClick={handleCancelClicked}>
                <ListItemIcon>
                    <UndoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Cancel" />
            </MenuItem>,
            <Divider key="divider" />,
            <MenuItem key="showadvanced" onClick={handleShowAdvancedClicked}>
                <ListItemIcon>{panelConfig?.data?.showAdvanced ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
                <ListItemText primary="Show Advanced" />
            </MenuItem>,
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
