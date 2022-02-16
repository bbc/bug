import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import BugApiTable from "@core/BugApiTable";
import BugTableLinkButton from "@core/BugTableLinkButton";
import BugApiSelect from "@core/BugApiSelect";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosPost from "@utils/AxiosPost";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import { useAlert } from "@utils/Snackbar";
import { useForceRefresh } from "@hooks/ForceRefresh";

export default function TabLabels({ panelId }) {
    const sendAlert = useAlert(panelId);
    const { renameDialog } = useBugRenameDialog();
    const { forceRefresh, doForceRefresh } = useForceRefresh();
    const destinations = [
        { id: -1, label: "Multiview 99" },
        { id: 1, label: "Multiview 1" },
        { id: 2, label: "Multiview 2" },
        { id: 3, label: "Multiview 3" },
        { id: 4, label: "Multiview 4" },
    ];

    const handleLabelClicked = async (event, item) => {
        let result = await renameDialog({
            title: "Edit label",
            defaultValue: item.label,
            placeholder: item.input,
            confirmButtonText: "Rename",
            allowBlank: true,
        });
        if (result === false) {
            return;
        }
        if (!result) {
            result = item.input;
        }

        if (
            await AxiosPost(`/container/${panelId}/label/set`, {
                inputIndex: item.inputIndex,
                label: result,
            })
        ) {
            doForceRefresh();
            sendAlert(`Changed label of input ${item.input} to '${result}'`, { variant: "success" });
        } else {
            sendAlert(`Failed to change label of input ${item.input}`, { variant: "error" });
        }
    };

    const handleAutoLabelStateChanged = async (checked, item) => {
        if (
            await AxiosPost(`/container/${panelId}/label/setautostate`, {
                inputIndex: item.inputIndex,
                state: checked,
            })
        ) {
            doForceRefresh();
            sendAlert(`${checked ? "Enabled" : "Disabled"} autolabel for input ${item.input}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${checked ? "enable" : "disable"} autolabel for input ${item.input}`, {
                variant: "error",
            });
        }
    };

    const handleAutoLabelIndexChanged = async (value, item) => {
        if (
            await AxiosPost(`/container/${panelId}/label/setautoindex`, {
                inputIndex: item.inputIndex,
                routerIndex: value,
            })
        ) {
            doForceRefresh();
            sendAlert(`Updated autolabel source for input ${item.input}`, { variant: "success" });
        } else {
            sendAlert(`Failed to update autolabel source for input ${item.input}`, {
                variant: "error",
            });
        }
    };

    return (
        <>
            <Grid item xs={12}>
                <BugApiTable
                    columns={[
                        {
                            title: "Input",
                            width: 44,
                            content: (item) => item.input,
                        },
                        {
                            title: "Multiview Label",
                            content: (item) => (
                                <BugTableLinkButton
                                    color="primary"
                                    disabled={item.autoLabelEnabled}
                                    onClick={(event) => handleLabelClicked(event, item)}
                                >
                                    {item?.label}
                                </BugTableLinkButton>
                            ),
                        },
                        {
                            title: "Router Destination",
                            hideWidth: 600,
                            content: (item) => (
                                <BugApiSelect
                                    value={item.autoLabelIndex}
                                    options={destinations}
                                    onChange={(event) => handleAutoLabelIndexChanged(event.target.value, item)}
                                />
                            ),
                        },
                        {
                            noPadding: true,
                            hideWidth: 600,
                            width: 70,
                            content: (item) => (
                                <BugApiSwitch
                                    checked={item.autoLabelEnabled}
                                    onChange={(checked) => handleAutoLabelStateChanged(checked, item)}
                                />
                            ),
                        },
                        {
                            title: "Router Label",
                            hideWidth: 600,
                            content: (item) => <TextField value={item.autoLabel} disabled fullWidth />,
                        },
                    ]}
                    apiUrl={`/container/${panelId}/label`}
                    forceRefresh={forceRefresh}
                />
            </Grid>
        </>
    );
}
