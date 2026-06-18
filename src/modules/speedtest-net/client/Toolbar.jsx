import BugApiButton from "@core/BugApiButton";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { useApiPoller } from "@hooks/ApiPoller";
import { usePanelToolbarEventTrigger } from "@hooks/PanelToolbarEvent";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosGet from "@utils/AxiosGet";
import { useAlert } from "@utils/Snackbar";
import React from "react";

export default function Toolbar({ panelId, ...props }) {
    let toolbarProps = { ...props };
    const sendAlert = useAlert();
    const triggerPanelEvent = usePanelToolbarEventTrigger();
    const [graphRefreshKey, setGraphRefreshKey] = React.useState(0);
    toolbarProps["onClick"] = null;

    const status = useApiPoller({
        url: `/container/${panelId}/test/status`,
        interval: 3000,
    });

    const downloadStats = useApiPoller({
        url: `/container/${panelId}/download/stats`,
        interval: 3000,
        forceRefresh: graphRefreshKey,
    });

    const uploadStats = useApiPoller({
        url: `/container/${panelId}/upload/stats`,
        interval: 3000,
        forceRefresh: graphRefreshKey,
    });

    const [currentTime, setCurrentTime] = React.useState(Date.now());

    React.useEffect(() => {
        if (!status?.data?.periodicTesting || !status?.data?.nextRunAt) {
            return;
        }

        setCurrentTime(Date.now());

        const timerId = window.setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => {
            window.clearInterval(timerId);
        };
    }, [status?.data?.periodicTesting, status?.data?.nextRunAt]);

    const hasGraphResults = (downloadStats.data?.length || 0) > 0 || (uploadStats.data?.length || 0) > 0;
    const hasResultRows = Boolean(status?.data?._id);
    const manualDisabled = status?.data?.running;
    const resetDisabled = manualDisabled || !hasGraphResults;

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

    const handleResetGraphs = async () => {
        if (await AxiosDelete(`/container/${panelId}/test/stats`)) {
            setGraphRefreshKey((currentValue) => currentValue + 1);
            triggerPanelEvent("refreshGraphs");
            sendAlert("Speedtest graphs reset", {
                broadcast: "true",
                variant: "success",
            });
        } else {
            sendAlert("Failed to reset speedtest graphs", {
                variant: "error",
            });
        }
    };

    const handleDeleteAll = async () => {
        if (await AxiosDelete(`/container/${panelId}/test/result`)) {
            setGraphRefreshKey((currentValue) => currentValue + 1);
            triggerPanelEvent("refreshGraphs");
            sendAlert("All test results deleted", {
                broadcast: "true",
                variant: "success",
            });
        } else {
            sendAlert("Failed to delete test results", {
                variant: "error",
            });
        }
    };

    const menuItems = () => [
        <MenuItem disabled={manualDisabled} onClick={handleStart} key="launch">
            <ListItemIcon>
                <PlayArrowIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Run Test" />
        </MenuItem>,
        <MenuItem disabled={resetDisabled} onClick={handleResetGraphs} key="reset-graphs">
            <ListItemIcon>
                <RestartAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Reset" />
        </MenuItem>,
        <MenuItem disabled={!hasResultRows} onClick={handleDeleteAll} key="delete-all">
            <ListItemIcon>
                <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Delete All" />
        </MenuItem>,
    ];

    const buttons = () => (
        <>
            <BugApiButton
                disabled={manualDisabled}
                variant="outlined"
                color={"primary"}
                onClick={handleStart}
                timeout={20000}
                icon={<PlayArrowIcon />}
            >
                Run Test
            </BugApiButton>
            <BugApiButton
                disabled={resetDisabled}
                variant="outlined"
                color={"primary"}
                onClick={handleResetGraphs}
                timeout={20000}
                icon={<RestartAltIcon />}
            >
                Reset
            </BugApiButton>
        </>
    );

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
