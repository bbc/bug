import React from "react";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugRouterGroupButton from "@core/BugRouterGroupButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BallotIcon from "@mui/icons-material/Ballot";
import EditIcon from "@mui/icons-material/Edit";
import AxiosDelete from "@utils/AxiosDelete";

export default function GroupButton({ panelId, group, onClick, groupType, editMode = false, onChange, onEditButtons }) {
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();

    const handleRenameClicked = async (event, item) => {
        const result = await renameDialog({
            title: "Rename group",
            defaultValue: group.label,
        });
        if (result !== false) {
            if (await AxiosCommand(`/container/${panelId}/groups/rename/${groupType}/${group.label}/${result}`)) {
                sendAlert(`Renamed group: ${group.label} -> ${result}`, { variant: "success" });
            } else {
                sendAlert(`Failed to rename group: ${group.label}`, { variant: "error" });
            }
            onChange();
        }
    };

    const handleDeleteClicked = async (event, item) => {
        if (await AxiosDelete(`/container/${panelId}/groups/${groupType}/${group.label}`)) {
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
                    title: groupType === "destination" ? `Edit Destinations` : `Edit Sources`,
                    icon: <BallotIcon fontSize="small" />,
                    onClick: onEditButtons,
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
                    title: "Delete",
                    icon: <DeleteIcon fontSize="small" />,
                    onClick: handleDeleteClicked,
                },
            ]}
        />
    );
}
