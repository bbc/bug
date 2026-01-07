import BugApiButton from "@core/BugApiButton";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { useApiPoller } from "@hooks/ApiPoller";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import { useAlert } from "@utils/Snackbar";

export default function Toolbar({ panelId, ...props }) {
    let toolbarProps = { ...props };
    const sendAlert = useAlert();
    toolbarProps["onClick"] = null;

    const status = useApiPoller({
        url: `/container/${panelId}/test/status`,
        interval: 3000,
    });

    const handleStart = async (event, item) => {
        if (await AxiosGet(`/container/${panelId}/test/start`)) {
            sendAlert("Speedtest has started", {
                broadcast: "true",
                variant: "success",
            });
        } else {
            sendAlert("Speedtest failed", {
                variant: "error",
            });
        }
    };

    const menuItems = () => [
        <MenuItem disabled={status?.data?.running} onClick={handleStart} key="launch">
            <ListItemIcon>
                <PlayArrowIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Run Test" />
        </MenuItem>,
    ];

    const buttons = () => (
        <>
            <BugApiButton
                disabled={status?.data?.running}
                variant="outlined"
                color={"primary"}
                onClick={handleStart}
                timeout={20000}
                icon={<PlayArrowIcon />}
            >
                Run Test
            </BugApiButton>
        </>
    );

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
