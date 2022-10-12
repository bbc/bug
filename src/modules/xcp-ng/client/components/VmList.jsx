import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import VmPowerIcon from "./VmPowerIcon";
import VmPowerState from "./VmPowerState";
import AxiosCommand from "@utils/AxiosCommand";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
import BugApiTable from "@core/BugApiTable";
import BugChipDisplay from "@core/BugChipDisplay";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import BugNoData from "@core/BugNoData";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugTableLinkButton from "@core/BugTableLinkButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import PowerIcon from "@mui/icons-material/Power";
import CachedIcon from "@mui/icons-material/Cached";
import BoltIcon from "@mui/icons-material/Bolt";
import MemoryIcon from "@mui/icons-material/Memory";
import LaunchIcon from "@mui/icons-material/Launch";
import { useSelector } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

export default function VmList({ panelId }) {
    const sendAlert = useAlert();
    const panelConfig = useSelector((state) => state.panelConfig);
    const { renameDialog } = useBugRenameDialog();
    const { confirmDialog } = useBugConfirmDialog();

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();
        const result = await renameDialog({
            title: "Edit name",
            defaultValue: item.name_label,
            confirmButtonText: "Save",
        });

        if (result !== false) {
            if (await AxiosCommand(`/container/${panelId}/vm/rename/${item.uuid}/${encodeURIComponent(result)}`)) {
                sendAlert(`Renamed VM '${item.name_label}' to '${result}'`, {
                    variant: "success",
                });
            } else {
                sendAlert(`Failed to rename VM '${item.name_label}'`, { variant: "error" });
            }
        }
    };

    const handleDeleteClicked = async (event, item) => {
        if (
            !(await confirmDialog({
                title: "Delete VM",
                message: [
                    `You are about to delete '${item.name_label}'.`,
                    `This action cannot be undone. Are you sure?`,
                ],
                confirmButtonText: "Delete",
            }))
        ) {
            // they've changed their mind ...
            return false;
        }
        sendAlert(`Deleting VM '${item.name_label}'`, { broadcast: "true", variant: "info" });

        if (await AxiosDelete(`/container/${panelId}/vm/${item.uuid}`)) {
            sendAlert(`Deleted VM '${item.name_label}'`, { variant: "success" });
        } else {
            sendAlert(`Failed to delete VM '${item.name_label}'`, { variant: "error" });
        }
    };

    const handleDescriptionClicked = async (event, item) => {
        event.stopPropagation();
        const result = await renameDialog({
            title: "Edit description",
            defaultValue: item.name_description,
            confirmButtonText: "Save",
        });

        if (result !== false) {
            if (
                await AxiosCommand(`/container/${panelId}/vm/setdescription/${item.uuid}/${encodeURIComponent(result)}`)
            ) {
                sendAlert(`Update description on VM '${item.name_label}'`, {
                    variant: "success",
                });
            } else {
                sendAlert(`Failed to update description on VM '${item.name_label}'`, { variant: "error" });
            }
        }
    };

    const handlePowerSwitchChanged = async (checked, item) => {
        if (checked) {
            handleStartClicked(null, item);
        } else {
            handleCleanShutdownClicked(null, item);
        }
    };

    const handleAutoPowerClicked = async (event, item) => {
        const checked = !item._autoPower;
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        if (await AxiosCommand(`/container/${panelId}/vm/${command}autopower/${item.uuid}`)) {
            sendAlert(`${commandText} auto power for VM '${item.name_label}'`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} auto power for VM '${item.name_label}'`, { variant: "error" });
        }
    };

    const handleStartClicked = async (event, item) => {
        sendAlert(`Starting VM '${item.name_label}'`, { broadcast: "true", variant: "info" });
        const response = await AxiosCommand(`/container/${panelId}/vm/start/${item.uuid}`);
        if (response) {
            sendAlert(`${item.name_label} has been started.`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`${item.name_label} could not be started.`, { variant: "warning" });
        }
    };

    const handleCleanShutdownClicked = async (event, item) => {
        sendAlert(`Stopping VM '${item.name_label}'`, { broadcast: "true", variant: "info" });
        const response = await AxiosCommand(`/container/${panelId}/vm/cleanshutdown/${item.uuid}`);
        if (response) {
            sendAlert(`${item.name_label} has been stopped.`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`${item.name_label} could not be stopped.`, { variant: "warning" });
        }
    };

    const handleHardShutdownClicked = async (event, item) => {
        sendAlert(`Stopping VM '${item.name_label}'`, { broadcast: "true", variant: "info" });
        const response = await AxiosCommand(`/container/${panelId}/vm/hardshutdown/${item.uuid}`);
        if (response) {
            sendAlert(`${item.name_label} has been stopped.`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`${item.name_label} could not be stopped.`, { variant: "warning" });
        }
    };

    const handleCleanRebootClicked = async (event, item) => {
        sendAlert(`Rebooting VM '${item.name_label}'`, { broadcast: "true", variant: "info" });
        const response = await AxiosCommand(`/container/${panelId}/vm/cleanreboot/${item.uuid}`);
        if (response) {
            sendAlert(`${item.name_label} has been rebooted.`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`${item.name_label} could not be rebooted.`, { variant: "warning" });
        }
    };

    const handleHardRebootClicked = async (event, item) => {
        sendAlert(`Rebooting VM '${item.name_label}'`, { broadcast: "true", variant: "info" });
        const response = await AxiosCommand(`/container/${panelId}/vm/hardreboot/${item.uuid}`);
        if (response) {
            sendAlert(`${item.name_label} has been rebooted.`, { broadcast: "true", variant: "success" });
        } else {
            sendAlert(`${item.name_label} could not be rebooted.`, { variant: "warning" });
        }
    };

    const handleLaunchClicked = async (event, item) => {
        if (panelConfig?.data?.xoUrl) {
            const url = `${panelConfig.data.xoUrl}/#/vms/${item.uuid}/general`;
            const newWindow = window.open(url, "_blank", "noopener,noreferrer");
            if (newWindow) newWindow.opener = null;
        }
    };

    return (
        <>
            <BugApiTable
                columns={[
                    {
                        title: "Active",
                        sortable: false,
                        noPadding: true,
                        hideWidth: 740,
                        width: 58,
                        field: "power_state",
                        filterType: "dropdown",
                        filterOptions: [
                            { id: "", label: "" },
                            { id: "Running", label: "On" },
                            { id: "Halted", label: "Off" },
                        ],
                        content: (item) => <VmPowerIcon item={item} />,
                    },
                    {
                        noPadding: true,
                        sortable: false,
                        hideWidth: 540,
                        width: 70,
                        align: "center",
                        content: (item) => {
                            return (
                                <BugApiSwitch
                                    timeout={20000}
                                    checked={item.power_state === "Running" || item.power_state === "Stopping"}
                                    onChange={(checked) => handlePowerSwitchChanged(checked, item)}
                                    disabled={Object.keys(item.current_operations).length > 0}
                                />
                            );
                        },
                    },
                    {
                        noPadding: true,
                        hideWidth: 1300,
                        width: 44,
                        content: (item) => {
                            if (item._autoPower) {
                                return <LockIcon sx={{ color: "primary.main" }} />;
                            }
                            return <LockOpenIcon sx={{ color: "#ffffff", opacity: 0.1 }} />;
                        },
                    },
                    {
                        title: "State",
                        sortable: false,
                        // noPadding: true,
                        width: 90,
                        minWidth: 90,
                        noWrap: false,
                        content: (item) => <VmPowerState item={item} />,
                    },
                    {
                        title: "Name",
                        // width: "50%",
                        minWidth: 200,
                        noWrap: true,
                        sortable: true,
                        field: "name_label",
                        defaultSortDirection: "asc",
                        filterType: "text",
                        content: (item) => {
                            return (
                                <>
                                    <BugTableLinkButton onClick={(event) => handleRenameClicked(event, item)}>
                                        {item.name_label}
                                    </BugTableLinkButton>
                                    <BugTableLinkButton
                                        onClick={(event) => handleDescriptionClicked(event, item)}
                                        color="secondary"
                                    >
                                        {item["name_description"]}
                                    </BugTableLinkButton>
                                </>
                            );
                        },
                    },
                    {
                        title: "Host",
                        width: "15%",
                        minWidth: 160,
                        noWrap: true,
                        sortable: true,
                        hideWidth: 1210,
                        field: "_residentHost",
                        defaultSortDirection: "asc",
                        filterType: "text",
                        content: (item) => item._residentHost,
                    },
                    {
                        title: "Agent",
                        sortable: false,
                        noPadding: true,
                        hideWidth: 1240,
                        width: 82,
                        content: (item) => {
                            return (
                                <MemoryIcon
                                    sx={{
                                        color: item._hasAgent ? "primary.main" : "secondary.main",
                                        opacity: item._hasAgent ? 1 : 0.1,
                                        display: "block",
                                        margin: "auto",
                                        minWidth: 36,
                                    }}
                                />
                            );
                        },
                    },
                    {
                        title: "Address",
                        width: 140,
                        sortable: true,
                        hideWidth: 874,
                        field: "_ipv4",
                        defaultSortDirection: "asc",
                        filterType: "text",
                        content: (item) => item._ipv4,
                    },
                    {
                        title: "Operating System",
                        width: 180,
                        sortable: true,
                        field: "_os",
                        defaultSortDirection: "asc",
                        hideWidth: 1380,
                        filterType: "text",
                        content: (item) => item._os,
                    },
                    {
                        title: "CPUs",
                        width: 80,
                        sortable: true,
                        align: "center",
                        field: "VCPUs_max",
                        filterType: "number",
                        hideWidth: 1140,
                        defaultSortDirection: "asc",
                        content: (item) => item.VCPUs_max,
                    },
                    {
                        title: "RAM",
                        width: 90,
                        sortable: true,
                        field: "memory_target",
                        filterType: "number",
                        hideWidth: 1140,
                        defaultSortDirection: "asc",
                        content: (item) => {
                            return item._memory;
                        },
                    },
                    {
                        title: "Tags",
                        width: "20%",
                        hideWidth: 1600,
                        content: (item) => <BugChipDisplay options={item["tags"]} />,
                    },
                ]}
                menuItems={[
                    {
                        title: "Rename",
                        icon: <EditIcon fontSize="small" />,
                        onClick: handleRenameClicked,
                    },
                    {
                        title: "Set Description",
                        icon: <CommentIcon fontSize="small" />,
                        onClick: handleDescriptionClicked,
                    },
                    {
                        title: "-",
                    },
                    {
                        title: "Start",
                        icon: <PlayArrowIcon fontSize="small" />,
                        disabled: (item) =>
                            item.power_state !== "Halted" || Object.keys(item.current_operations).length > 0,
                        onClick: handleStartClicked,
                    },
                    {
                        title: "Stop",
                        icon: <StopIcon fontSize="small" />,
                        disabled: (item) =>
                            item.power_state === "Halted" || Object.keys(item.current_operations).length > 0,
                        onClick: handleCleanShutdownClicked,
                    },
                    {
                        title: "Reboot",
                        icon: <CachedIcon fontSize="small" />,
                        disabled: (item) =>
                            item.power_state === "Halted" || Object.keys(item.current_operations).length > 0,
                        onClick: handleCleanRebootClicked,
                    },
                    {
                        title: "-",
                    },
                    {
                        title: "Force Stop",
                        icon: <PowerIcon fontSize="small" />,
                        disabled: (item) => item.power_state === "Halted",
                        onClick: handleHardShutdownClicked,
                    },
                    {
                        title: "Force Reboot",
                        icon: <BoltIcon fontSize="small" />,
                        disabled: (item) => item.power_state === "Halted",
                        onClick: handleHardRebootClicked,
                    },
                    {
                        title: "-",
                    },
                    {
                        title: "Launch in XO",
                        icon: <LaunchIcon fontSize="small" />,
                        disabled: panelConfig?.data?.xoUrl ? false : true,
                        onClick: handleLaunchClicked,
                    },
                    {
                        title: "Auto Power",
                        icon: (item) => (item._autoPower ? <CheckIcon fontSize="small" /> : null),
                        onClick: handleAutoPowerClicked,
                    },
                    {
                        title: "-",
                    },
                    {
                        title: "Delete",
                        icon: <DeleteIcon fontSize="small" />,
                        onClick: handleDeleteClicked,
                        disabled: (item) => !item.allowed_operations.includes("destroy"),
                    },
                ]}
                defaultSortIndex={3}
                apiUrl={`/container/${panelId}/vm`}
                sortable
                rowHeight="58px"
                filterable
                noData={<BugNoData panelId={panelId} title="No VMs found" showConfigButton={false} />}
            />
        </>
    );
}
