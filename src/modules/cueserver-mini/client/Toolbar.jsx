import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useApiPoller } from "@hooks/ApiPoller";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import BugApiSelect from "@core/BugApiSelect";
import LaunchIcon from "@mui/icons-material/Launch";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import { useLocation } from "react-router-dom";

export default function Toolbar({ panelId, ...props }) {
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const location = useLocation();

    const playbackList = useApiPoller({
        url: `/container/${panelId}/playback`,
        interval: 1000,
    });

    const activePlayback = playbackList.data && playbackList.data.find((pl) => pl.active === true)["number"];

    const isConsolePage = location.pathname.indexOf("/display/console") > -1;

    const handleLaunchClicked = async (event, item) => {
        if (panelConfig?.data?.address) {
            const url = `http://${panelConfig.data.address}`;
            const newWindow = window.open(url, "_blank", "noopener,noreferrer");
            if (newWindow) newWindow.opener = null;
        }
    };

    const handleActiveChanged = async (value) => {
        const url = `/container/${panelId}/playback/select/${value}`;
        if (await AxiosCommand(url)) {
            sendAlert(`Selected playback ${value}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to load playback ${value}`, {
                variant: "error",
            });
        }
    };

    const handleClearAll = async (event) => {
        const url = `/container/${panelId}/playback/clear`;
        if (await AxiosCommand(url)) {
            sendAlert(`Cleared all playbacks`, {
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to clear all playbacks`, {
                variant: "error",
            });
        }
    };

    let toolbarProps = { ...props };

    const buttons = () => (
        <>
            <BugApiSelect
                key="playbacks"
                value={playbackList.data ? activePlayback : null}
                options={[
                    { id: 1, label: "Playback 1" },
                    { id: 2, label: "Playback 2" },
                    { id: 3, label: "Playback 3" },
                    { id: 4, label: "Playback 4" },
                ]}
                onChange={(event) => handleActiveChanged(event.target.value)}
                fullWidth={false}
                variant="outlined"
                sx={{
                    width: "8rem",
                    "& .MuiInputBase-root": {
                        borderRadius: "4px !important",
                    },
                    "& .MuiSelect-select": {
                        padding: "8px",
                        paddingLeft: "12px",
                        textTransform: "uppercase",
                        fontWeight: 500,
                    },
                }}
            />
            {isConsolePage && (
                <Button
                    key="save_button"
                    variant="outlined"
                    color="primary"
                    onClick={handleClearAll}
                    startIcon={<ClearIcon />}
                >
                    Clear All
                </Button>
            )}
        </>
    );

    const menuItems = () => {
        return [
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
