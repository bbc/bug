import BugItemMenu from "@components/BugItemMenu";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useBugCustomDialog } from "@core/BugCustomDialog";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugStatusLabel from "@core/BugStatusLabel";
import { useApiPoller } from "@hooks/ApiPoller";
import { useForceRefresh } from "@hooks/ForceRefresh";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import TableRowsIcon from "@mui/icons-material/TableRows";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { useEffect } from "react";
import AddEntryButton from "./AddEntryButton";
import SetGroupDialog from "./SetGroupDialog";

const EntryStatus = ({ entry }) => {
    if (entry.static) {
        return <BugStatusLabel>STATIC</BugStatusLabel>;
    }
    if (entry.dhcpStatus === "waiting") {
        return <BugStatusLabel sx={{ color: "error.main" }}>OFFLINE</BugStatusLabel>;
    }
    if (entry.dhcpStatus === "bound") {
        return <BugStatusLabel sx={{ color: "success.main" }}>ONLINE</BugStatusLabel>;
    }
    return <BugStatusLabel>UNKNOWN</BugStatusLabel>;
};

export default function EntryList({ panelId }) {
    const sendAlert = useAlert();
    const [forceRefresh, doForceRefresh] = useForceRefresh();
    const { renameDialog } = useBugRenameDialog();
    const { customDialog } = useBugCustomDialog();
    const { confirmDialog } = useBugConfirmDialog();

    const entries = useApiPoller({
        url: `/container/${panelId}/entry`,
        interval: 2000,
        forceRefresh,
    });

    const wans = useApiPoller({
        url: `/container/${panelId}/wan`,
        interval: 2000,
    });

    useEffect(() => {
        if (location.state?.forceRefresh) {
            console.log("Force refreshing entry list due to navigation state");
            doForceRefresh();

            // Clean up the state so refreshing the browser
            // doesn't trigger another force refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state, doForceRefresh]);

    const groupNames = entries.data ? entries.data.map((g) => g.group).filter((name) => name !== "UNGROUPED") : [];

    const handleEntryClick = async (item, wan) => {
        const response = await AxiosPut(`/container/${panelId}/entry/route`, {
            address: item.address,
            list: wan.name,
        });
        if (response) {
            sendAlert(`Changed route of ${item.label} to ${wan.comment ? wan.comment : wan.name}`, {
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to change route of ${item.label} to ${wan.comment ? wan.comment : wan.name}`, {
                variant: "error",
            });
        }
    };

    const handleDefaultEntryClick = async (item) => {
        const response = await AxiosDelete(`/container/${panelId}/entry/route`, {
            address: item.address,
        });
        if (response) {
            sendAlert(`Removed route for ${item.label}`, {
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to remove route for ${item.label}`, {
                variant: "error",
            });
        }
    };

    const handleRenameClicked = async (_, item) => {
        const result = await renameDialog({
            title: "Edit name",
            defaultValue: item["label"],
            placeholder: "Enter custom label",
            confirmButtonText: "Rename",
            allowBlank: false,
        });
        if (result !== false) {
            if (
                await AxiosPut(`/container/${panelId}/entry/setlabel/`, {
                    address: item.address,
                    label: result,
                })
            ) {
                sendAlert(`Renamed entry to ${result}`, { broadcast: "true", variant: "success" });
                doForceRefresh();
            } else {
                sendAlert(`Failed to rename entry to ${result}`, { variant: "error" });
            }
        }
    };

    const handleSetGroupClicked = async (_, item) => {
        const result = await customDialog({
            dialog: <SetGroupDialog groups={groupNames} value={item.group.toUpperCase()} />,
        });
        if (result !== false) {
            if (
                await AxiosPut(`/container/${panelId}/entry/setgroup/`, {
                    address: item.address,
                    group: result,
                })
            ) {
                sendAlert(`Changed group to ${result}`, { broadcast: "true", variant: "success" });
                doForceRefresh();
            } else {
                sendAlert(`Failed to change group to ${result}`, { variant: "error" });
            }
        }
    };

    const handleDeleteClicked = async (_, item) => {
        if (
            !(await confirmDialog({
                title: "Remove Entry",
                message: [
                    `This will remove this entry from BUG, but will not delete the DHCP lease on the router.`,
                    `Are you sure?`,
                ],
                confirmButtonText: "Delete",
            }))
        ) {
            // they've changed their mind ...
            return false;
        }

        if (await AxiosDelete(`/container/${panelId}/dhcp/${item.address}`)) {
            sendAlert(`Removed SDWAN entry`, { variant: "success" });
        } else {
            sendAlert(`Failed to remove SDWAN entry`, { variant: "error" });
        }
    };

    const handleLockedClicked = async (event, item) => {
        const response = await AxiosPut(`/container/${panelId}/entry/${item.isLocked ? "unlock" : "lock"}/`, {
            address: item.address,
        });
        if (response) {
            sendAlert(`${item.isLocked ? "Unlocked" : "Locked"} ${item.label}`, {
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to ${item.isLocked ? "unlock" : "lock"} route for ${item.label}`, {
                variant: "error",
            });
        }
    };

    const menuItems = [
        {
            title: "Edit Name",
            icon: <EditIcon fontSize="small" />,
            onClick: handleRenameClicked,
        },
        {
            title: "Edit Group",
            icon: <TableRowsIcon fontSize="small" />,
            onClick: handleSetGroupClicked,
        },
        {
            title: "-",
        },
        {
            title: "Locked",
            icon: (item) => (item.isLocked ? <CheckIcon fontSize="small" /> : <></>),
            onClick: handleLockedClicked,
        },
        {
            title: "-",
        },
        {
            title: "Delete",
            icon: <DeleteIcon fontSize="small" />,
            onClick: handleDeleteClicked,
        },
    ];

    if (entries?.status === "loading" || wans?.status === "loading") {
        return null;
    }
    if (entries?.status !== "success" || wans?.status !== "success") {
        return null;
    }

    if (entries?.data?.length === 0) {
        return (
            <Box sx={{ p: 2 }}>
                <AddEntryButton />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 0.5 }}>
            {entries?.data?.map((group) => (
                <Box key={group.group} sx={{ mb: 1 }}>
                    <Typography
                        sx={{
                            p: 2,
                            bgcolor: "background.accent",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            color: "text.primary",
                        }}
                    >
                        {group.group}
                    </Typography>

                    {group.items.map((item, index) => {
                        const isOffline = item.dhcpStatus === "waiting" && !item.static;
                        return (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "nowrap",
                                    p: 1,
                                    borderBottom: "1px solid",
                                    borderColor: "border.light",
                                    borderRadius: 0,
                                    gap: 2,
                                    bgcolor: "background.paper",
                                }}
                            >
                                <Box sx={{ flexShrink: 0, minWidth: "160px", pl: 1 }}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        sx={{ justifyContent: "space-between" }}
                                    >
                                        <Stack sx={{ whiteSpace: "nowrap" }}>
                                            <Typography sx={{ fontWeight: 600 }}>
                                                {item.label || item.address}
                                            </Typography>
                                            <EntryStatus entry={item} />
                                        </Stack>
                                        {item.isLocked && (
                                            <LockIcon
                                                sx={{
                                                    fontSize: "1.1rem",
                                                    color: "text.secondary",
                                                    opacity: 0.7,
                                                }}
                                            />
                                        )}
                                    </Stack>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1,
                                        flexGrow: 1,
                                        justifyContent: "flex-start",
                                        "& > button": {
                                            flex: "0 0 140px",
                                            height: 60,
                                            fontSize: "0.8rem",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        },
                                    }}
                                >
                                    {wans?.data?.map((wan) => {
                                        const isActive = wan.name === item?.list;
                                        return (
                                            <Button
                                                color={item.isLocked || isOffline ? "secondary" : "primary"}
                                                key={wan.id}
                                                variant={isActive ? "contained" : "outlined"}
                                                onClick={() => {
                                                    if (!item.isLocked && !isActive) {
                                                        handleEntryClick(item, wan);
                                                    }
                                                }}
                                                sx={{
                                                    cursor: item.isLocked ? "default" : "pointer",
                                                    WebkitTapHighlightColor: item.isLocked ? "transparent" : "inherit",
                                                }}
                                            >
                                                {wan.comment ? wan.comment : wan.name}
                                            </Button>
                                        );
                                    })}

                                    <Button
                                        color={item.isLocked || isOffline ? "secondary" : "primary"}
                                        variant={!item?.list ? "contained" : "outlined"}
                                        onClick={() => {
                                            if (!item?.isLocked && item?.list) {
                                                handleDefaultEntryClick(item);
                                            }
                                        }}
                                        sx={{
                                            cursor: item.isLocked ? "default" : "pointer",
                                            WebkitTapHighlightColor: item.isLocked ? "transparent" : "inherit",
                                        }}
                                    >
                                        DEFAULT
                                    </Button>
                                </Box>

                                <Box sx={{ flexShrink: 0, ml: "auto", pl: 1 }}>
                                    <BugItemMenu item={item} menuItems={menuItems} />
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>
            ))}
        </Box>
    );
}
