import React from "react";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugRouterGroupButton from "@core/BugRouterGroupButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BallotIcon from "@mui/icons-material/Ballot";
import EditIcon from "@mui/icons-material/Edit";
import AxiosDelete from "@utils/AxiosDelete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function GroupButton({ panelId, group, onClick, groupType, editMode = false, onChange, onEditButtons }) {
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();

    const handleRenameClicked = async (event, item) => {
        const result = await renameDialog({
            title: "Rename group",
            defaultValue: group.label === group.defaultLabel ? "" : group.label,
            placeholder: group.defaultLabel,
            allowBlank: group.fixed,
        });
        if (result !== false) {
            if (
                await AxiosCommand(
                    `/container/${panelId}/group/rename/${encodeURIComponent(groupType)}/${encodeURIComponent(
                        group.index
                    )}/${encodeURIComponent(result)}`
                )
            ) {
                sendAlert(`Renamed group: ${group.label} -> ${result}`, { variant: "success" });
            } else {
                sendAlert(`Failed to rename group: ${group.label}`, { variant: "error" });
            }
            onChange();
        }
    };

    const handleResetNameClicked = async (event, item) => {
        if (
            await AxiosCommand(
                `/container/${panelId}/group/rename/${encodeURIComponent(groupType)}/${encodeURIComponent(group.index)}`
            )
        ) {
            sendAlert(`Renamed group: ${group.label}`, { variant: "success" });
        } else {
            sendAlert(`Failed to rename group: ${group.label}`, { variant: "error" });
        }
        onChange();
    };

    const handleDeleteClicked = async (event, item) => {
        if (await AxiosDelete(`/container/${panelId}/group/${groupType}/${group.index}`)) {
            sendAlert(`Deleted group: ${group.label}`, { variant: "success" });
        } else {
            sendAlert(`Failed to delete group: ${group.label}`, { variant: "error" });
        }
        onChange();
    };

    return (
        <BugRouterGroupButton
            id={`group:${groupType}:${group.index}`}
            draggable
            onClick={onClick}
            item={group}
            primaryLabel={group.label}
            selected={group.selected}
            editMode={editMode}
            menuItems={[
                {
                    disabled: group.fixed,
                    title: groupType === "destination" ? `Edit Destinations` : `Edit Sources`,
                    icon: <BallotIcon fontSize="small" />,
                    onClick: onEditButtons,
                },
                {
                    title: "-",
                },
                {
                    title: "Reset Name",
                    disabled: !group.fixed,
                    icon: <RestartAltIcon fontSize="small" />,
                    onClick: handleResetNameClicked,
                },
                {
                    title: "Rename",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
                },
                {
                    title: "Delete",
                    disabled: group.fixed,
                    icon: <DeleteIcon fontSize="small" />,
                    onClick: handleDeleteClicked,
                },
            ]}
        />
    );
}
