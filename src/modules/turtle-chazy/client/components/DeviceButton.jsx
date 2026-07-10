import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugRouterGroupButton from "@core/BugRouterGroupButton";
import EditIcon from "@mui/icons-material/Edit";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";

export default function DeviceButton({ panelId, group, onClick, groupType, editMode = false, onChange }) {
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();
    const { confirmDialog } = useBugConfirmDialog();

    const handleRenameClicked = async (event, item) => {
        const result = await renameDialog({
            title: "Rename device",
            defaultValue: group.label,
        });
        if (result !== false) {
            const confirmResult = await confirmDialog({
                title: "Rename Device",
                message: "This will clear all routes for this device. Are you sure?",
                confirmButtonText: "Rename",
            });
            if (!confirmResult) {
                // they've changed their mind ...
                return false;
            }

            if (
                await AxiosPost(`/container/${panelId}/device/rename/${encodeURIComponent(group.label)}`, {
                    name: result,
                })
            ) {
                sendAlert(`Renamed device: ${group.label} -> ${result}`, { variant: "success" });
            } else {
                sendAlert(`Failed to rename device: ${group.label}`, { variant: "error" });
            }
            onChange();
        }
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
            wide
            menuItems={[
                {
                    title: "Rename",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
                },
            ]}
        />
    );
}
