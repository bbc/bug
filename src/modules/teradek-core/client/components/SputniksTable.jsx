import React from "react";
import { makeStyles } from "@mui/styles";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApiPoller } from "@utils/ApiPoller";
import BugApiTable from "@core/BugApiTable";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import BugApiSwitch from "@core/BugApiSwitch";
import Chip from "@mui/material/Chip";
import CloudIcon from "@mui/icons-material/Cloud";
import VideocamIcon from "@mui/icons-material/Videocam";
import AxiosGet from "@utils/AxiosGet";
import AxiosCommand from "@utils/AxiosCommand";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import { useAlert } from "@utils/Snackbar";
import { useHistory } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AxiosDelete from "@utils/AxiosDelete";
import Typography from "@mui/material/Typography";
import BugSparkCell from "@core/BugSparkCell";
import BugVolumeBar from "@core/BugVolumeBar";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";

const height = 100;

export default function SputniksTable({ panelId }) {
    const classes = useStyles();

    return (
        <BugApiTable
            columns={[
                {
                    sortable: false,
                    noPadding: true,
                    // hideWidth: 440,
                    width: 58,
                    field: "status",
                    content: (item) => {
                        return (
                            <PowerSettingsNew
                                className={item.streamStatus === "streaming" ? classes.iconRunning : classes.icon}
                            ></PowerSettingsNew>
                        );
                    },
                },
                {
                    sortable: false,
                    noPadding: true,
                    // hideWidth: 1200,
                    width: 70,
                    content: (item) => {
                        return (
                            <BugApiSwitch
                                checked={itemIsActive(item)}
                                onChange={(checked) => handleEnabledChanged(checked, item)}
                            />
                        );
                    },
                },
                {
                    width: 214,
                    content: (item) => {
                        return getThumbnail(item);
                    },
                },
                {
                    width: 300,
                    minWidth: 200,
                    noWrap: true,
                    content: (item) => (
                        <>
                            <Typography variant="body1">{item.customName}</Typography>
                            <Typography variant="subtitle1" sx={{ opacity: 0.5 }}>
                                {item.model}
                            </Typography>
                        </>
                    ),
                },
                {
                    content: (item) => (
                        <Box
                            sx={{
                                maxHeight: 100,
                                overflow: "auto",
                            }}
                        >
                            {getLinkedDevices(item)}
                        </Box>
                    ),
                },
                {
                    width: 300,
                    content: (item) => (
                        <BugSparkCell
                            height={80}
                            value={item["bitrate-text"]}
                            history={item.encoderStatsVideo?.slice(-60)}
                        />
                    ),
                },
            ]}
            menuItems={[
                {
                    title: "Enable",
                    disabled: (item) => !item.disabled,
                    icon: <ToggleOnIcon fontSize="small" />,
                    onClick: (event, item) => {
                        handleEnabledChanged(true, item);
                    },
                },
                {
                    title: "Disable",
                    disabled: (item) => item.disabled,
                    icon: <ToggleOffIcon fontSize="small" />,
                    onClick: (event, item) => {
                        handleEnabledChanged(false, item);
                    },
                },
                {
                    title: "-",
                },
                {
                    title: "Rename Encoder",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
                },
                {
                    title: "Restart Video",
                    icon: <RestartAltIcon fontSize="small" />,
                    onClick: handleRestartClicked,
                },
                {
                    title: "Reboot Encoder",
                    icon: <PowerSettingsNewIcon fontSize="small" />,
                    onClick: handleRebootClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "View on Core",
                    icon: <LaunchIcon fontSize="small" />,
                    onClick: handleCoreClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Remove",
                    icon: <DeleteIcon fontSize="small" />,
                    onClick: handleRemoveClicked,
                },
            ]}
            defaultSortIndex={4}
            apiUrl={`/container/${panelId}/encoder/selected`}
            panelId={panelId}
            onRowClick={handleRowClicked}
            hideHeader={true}
        />
    );
}
