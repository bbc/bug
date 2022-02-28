import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import { useHistory } from "react-router-dom";
import { useAlert } from "@utils/Snackbar";
import AxiosPost from "@utils/AxiosPost";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugApiTable from "@core/BugApiTable";
import BugTableLinkButton from "@core/BugTableLinkButton";
import BugNoData from "@core/BugNoData";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import TimerIcon from "@mui/icons-material/Timer";
import AxiosCommand from "@utils/AxiosCommand";

export default function OutputsList({ panelId }) {
    const history = useHistory();
    const sendAlert = useAlert(panelId);
    const { renameDialog } = useBugRenameDialog();

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();
        const result = await renameDialog({
            title: "Edit name",
            defaultValue: item.name,
            confirmButtonText: "Change",
        });

        if (result !== false) {
            if (await AxiosPost(`/container/${panelId}/output/${item.number}/name`, { name: result })) {
                sendAlert(`Renamed output ${item.number} to '${result}'`, {
                    variant: "success",
                });
            } else {
                sendAlert(`Failed to rename output`, { variant: "error" });
            }
        }
    };

    const handleDelayClicked = async (event, item) => {
        event.stopPropagation();
        const result = await renameDialog({
            title: "Edit delay",
            defaultValue: item.delay,
            confirmButtonText: "Change",
            textFieldProps: {
                numeric: true,
                min: 0,
                max: 236,
            },
        });

        if (result !== false) {
            if (await AxiosPost(`/container/${panelId}/output/${item.number}/delay`, { delay: parseInt(result) })) {
                sendAlert(`Set output ${item.number} delay to ${result} seconds`, {
                    variant: "success",
                });
            } else {
                sendAlert(`Failed to change output delay`, { variant: "error" });
            }
        }
    };

    const handleDetailsClicked = (event, item) => {
        history.push(`/panel/${panelId}/output/${item.number}`);
    };

    const handleProtectClicked = async (event, item) => {
        const command = item._protected ? "unprotect" : "protect";
        const commandAction = item._protected ? "Unprotected" : "Protected";

        if (await AxiosCommand(`/container/${panelId}/output/${item.number}/${command}`)) {
            sendAlert(`${commandAction} output ${item.number}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} output ${item.number}`, { variant: "error" });
        }
    };

    const handleEnabledChanged = async (checked, item) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        if (
            await AxiosPost(`/container/${panelId}/output/${item.number}/state`, {
                state: !item.state,
            })
        ) {
            sendAlert(`${commandText} ${item.name}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} ${item.name}`, { variant: "error" });
        }
    };

    const handleEnabledClicked = (event, item) => {
        handleEnabledChanged(true, item);
    };

    const handleDisabledClicked = (event, item) => {
        handleEnabledChanged(false, item);
    };

    return (
        <>
            <BugApiTable
                columns={[
                    {
                        title: "Enabled",
                        sortable: false,
                        noPadding: true,
                        hideWidth: 600,
                        width: 82,
                        content: (item) => {
                            return (
                                <BugApiSwitch
                                    checked={item.state}
                                    onChange={(checked) => handleEnabledChanged(checked, item)}
                                    disabled={item._protected}
                                />
                            );
                        },
                    },
                    {
                        title: "Name",
                        width: "80%",
                        minWidth: 100,
                        noWrap: true,
                        content: (item) => {
                            return (
                                <>
                                    <BugTableLinkButton
                                        disabled={item._protected}
                                        onClick={(event) => handleRenameClicked(event, item)}
                                    >
                                        {item.name}
                                    </BugTableLinkButton>
                                </>
                            );
                        },
                    },
                    {
                        title: "Fuse",
                        width: "20%",
                        minWidth: 110,
                        noWrap: true,
                        content: (item) => {
                            return <>{item.fuse.toUpperCase()}</>;
                        },
                    },
                    {
                        title: "Delay",
                        hideWidth: 450,
                        minWidth: 120,
                        noWrap: true,
                        content: (item) => {
                            return (
                                <>
                                    <BugTableLinkButton onClick={(event) => handleDelayClicked(event, item)}>
                                        {item.delay} second(s)
                                    </BugTableLinkButton>
                                </>
                            );
                        },
                    },
                ]}
                menuItems={[
                    {
                        title: "View Details",
                        icon: <SettingsInputComponentIcon fontSize="small" />,
                        onClick: handleDetailsClicked,
                    },
                    {
                        title: "-",
                    },
                    {
                        title: "Enable",
                        disabled: (item) => item.state,
                        icon: <ToggleOnIcon fontSize="small" />,
                        onClick: handleEnabledClicked,
                    },
                    {
                        title: "Disable",
                        disabled: (item) => !item.state,
                        icon: <ToggleOffIcon fontSize="small" />,
                        onClick: handleDisabledClicked,
                    },
                    {
                        title: "-",
                    },
                    {
                        title: "Rename",
                        icon: <EditIcon fontSize="small" />,
                        onClick: handleRenameClicked,
                    },
                    {
                        title: "Set Delay",
                        icon: <TimerIcon fontSize="small" />,
                        onClick: handleDelayClicked,
                    },
                    {
                        title: "-",
                    },
                    {
                        title: "Protect",
                        icon: (item) => (item._protected ? <CheckIcon fontSize="small" /> : null),
                        onClick: handleProtectClicked,
                    },
                ]}
                apiUrl={`/container/${panelId}/output/`}
                onRowClick={handleDetailsClicked}
                noData={<BugNoData panelId={panelId} title="No leases found" showConfigButton={false} />}
            />
        </>
    );
}
