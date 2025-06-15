import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugRouterGroupButton from "@core/BugRouterGroupButton";
import BallotIcon from "@mui/icons-material/Ballot";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AxiosCommand from "@utils/AxiosCommand";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
import React from "react";

export default function GroupButton({ panelId, group, onClick, groupType, editMode = false, onChange, onEditButtons }) {
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();

    const handleRenameClicked = async (event, item) => {
        const result = await renameDialog({
            title: "Rename group",
            defaultValue: group.label,
        });
        if (result !== false) {
            if (
                await AxiosCommand(
                    `/container/${panelId}/groups/rename/${encodeURIComponent(group.id)}/${encodeURIComponent(result)}`
                )
            ) {
                sendAlert(`Renamed group: ${group.label} -> ${result}`, { variant: "success" });
            } else {
                sendAlert(`Failed to rename group: ${group.label}`, { variant: "error" });
            }
            onChange();
        }
    };

    const handleDeleteClicked = async (event, item) => {
        if (await AxiosDelete(`/container/${panelId}/groups/${group.id}`)) {
            sendAlert(`Deleted group: ${group.label}`, { variant: "success" });
        } else {
            sendAlert(`Failed to delete group: ${group.label}`, { variant: "error" });
        }
        onChange();
    };

    return React.useMemo(
        () => (
            <BugRouterGroupButton
                id={`group:${groupType}:${group.index}`}
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
                        title: "Rename",
                        disabled: group.fixed,
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
        ),
        [group.label, group.selected, editMode]
    );
}
