import BugApiButton from "@core/BugApiButton";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { useApiPoller } from "@hooks/ApiPoller";
import LaunchIcon from "@mui/icons-material/Launch";
import SaveIcon from "@mui/icons-material/Save";
import { Divider, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useSelector } from "react-redux";

export default function Toolbar({ panelId, ...props }) {
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const panel = useSelector((state) => state.panel);

    const pending = useApiPoller({
        url: `/container/${panelId}/pending/`,
        interval: 1000,
    });

    const isPending = pending.status === "success" && pending.data;

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
            <BugApiButton
                variant="outlined"
                color={isPending ? "warning" : "primary"}
                onClick={handleSave}
                timeout={20000}
                icon={<SaveIcon />}
            >
                Save
            </BugApiButton>
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
