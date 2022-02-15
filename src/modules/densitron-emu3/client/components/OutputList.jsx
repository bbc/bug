import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import { useAlert } from "@utils/Snackbar";
import AxiosPost from "@utils/AxiosPost";
import AxiosCommand from "@utils/AxiosCommand";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugApiTable from "@core/BugApiTable";
import BugTableLinkButton from "@core/BugTableLinkButton";
import BugNoData from "@core/BugNoData";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";

export default function OutputList({ panelId, deviceIndex }) {
    const sendAlert = useAlert(panelId);
    const { renameDialog } = useBugRenameDialog();

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();
        let result = await renameDialog({
            title: "Edit name",
            defaultValue: item.outputName,
            placeholder: `Output ${item.outputIndex}`,
            confirmButtonText: "Change",
            allowBlank: true,
        });

        if (result !== false) {
            if (
                await AxiosPost(`/container/${panelId}/output/${deviceIndex}/${item.outputIndex}/name`, {
                    name: result,
                })
            ) {
                sendAlert(`Renamed output ${item.outputIndex} to '${result}'`, {
                    variant: "success",
                });
            } else {
                sendAlert(`Failed to rename output`, { variant: "error" });
            }
        }
    };

    const handleProtectClicked = async (event, item) => {
        const command = item._protected ? "unprotect" : "protect";
        const commandAction = item._protected ? "Unprotected" : "Protected";

        if (await AxiosCommand(`/container/${panelId}/output/${deviceIndex}/${item.outputIndex}/${command}`)) {
            sendAlert(`${commandAction} output ${item.outputIndex}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} output ${item.outputIndex}`, { variant: "error" });
        }
    };

    const handleEnabledChanged = async (checked, item) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        if (
            await AxiosPost(`/container/${panelId}/output/${deviceIndex}/${item.outputIndex}/state`, {
                state: checked,
            })
        ) {
            sendAlert(`${commandText} ${item.outputName}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} ${item.outputName}`, { variant: "error" });
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
                        sortable: false,
                        noPadding: true,
                        width: 82,
                        content: (item) => {
                            return <>{item.outputIndex}</>;
                        },
                    },
                    {
                        title: "State",
                        sortable: false,
                        noPadding: true,
                        hideWidth: 600,
                        width: 82,
                        content: (item) => {
                            return (
                                <BugApiSwitch
                                    checked={item.outputState === 0}
                                    disabled={item._protected}
                                    onChange={(checked) => handleEnabledChanged(checked, item)}
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
                                    <BugTableLinkButton onClick={(event) => handleRenameClicked(event, item)}>
                                        {item.outputName}
                                    </BugTableLinkButton>
                                </>
                            );
                        },
                    },
                    {
                        title: "Fuse",
                        width: "10%",
                        minWidth: 110,
                        noWrap: true,
                        content: (item) => {
                            if (item.outputState === 3) {
                                return <>FAILED</>;
                            }
                            return <>OK</>;
                        },
                    },
                ]}
                menuItems={[
                    {
                        title: "Enable",
                        disabled: (item) => item.outputState === 0,
                        icon: <ToggleOnIcon fontSize="small" />,
                        onClick: handleEnabledClicked,
                    },
                    {
                        title: "Disable",
                        disabled: (item) => item.outputState !== 0,
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
                        title: "-",
                    },
                    {
                        title: "Protect",
                        icon: (item) => (item._protected ? <CheckIcon fontSize="small" /> : null),
                        onClick: handleProtectClicked,
                    },
                ]}
                apiUrl={`/container/${panelId}/output/${deviceIndex}`}
                noData={<BugNoData panelId={panelId} title="No outputs found" showConfigButton={false} />}
            />
        </>
    );
}
