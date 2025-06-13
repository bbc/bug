import { useBugCustomDialog } from "@core/BugCustomDialog";
import BugLoading from "@core/BugLoading";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import Box from "@mui/material/Box";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AddGroupButton from "./AddGroupButton";
import EditButtonsDialog from "./EditButtonsDialog";
import GroupButton from "./GroupButton";

export default function GroupButtons({
    panelId,
    editMode = false,
    groupType,
    buttons,
    onChange,
    destinationGroup = 0,
    sourceGroup = 0,
}) {
    const sendAlert = useAlert();
    const history = useHistory();
    const [localButtons, setLocalButtons] = useState(null);
    const { renameDialog } = useBugRenameDialog();
    const { customDialog } = useBugCustomDialog();

    useEffect(() => {
        setLocalButtons(buttons.data.groups);
    }, [buttons]);

    const handleGroupButtonClicked = (groupIndex) => {
        const editText = editMode ? "/edit" : "";

        if (groupType === "source") {
            history.push(`/panel/${panelId}${editText}/${groupIndex}/${destinationGroup}`);
        } else {
            history.push(`/panel/${panelId}${editText}/${sourceGroup}/${groupIndex}`);
        }
    };

    const handleAddGroupClicked = async (event) => {
        const result = await renameDialog({
            title: "Add group",
            defaultValue: "",
            confirmButtonText: "Add",
        });
        if (result !== false) {
            if (await AxiosPost(`/container/${panelId}/groups/${result}`)) {
                sendAlert(`Added group: ${result}`, { variant: "success" });
                onChange();
            } else {
                sendAlert(`Failed to add group: ${result}`, { variant: "error" });
            }
        }
    };

    const handleEditButtonsClicked = async (event, item) => {
        const result = await customDialog({
            dialog: (
                <EditButtonsDialog panelId={panelId} groupType={groupType} groupIndex={item.index} groupId={item.id} />
            ),
        });
        if (result !== false) {
            sendAlert(`Updated buttons for group: ${item.label}`, { variant: "success" });
            onChange();
        }
    };

    if (!localButtons) {
        return <BugLoading />;
    }

    return (
        <Box
            sx={{
                whiteSpace: "nowrap",
            }}
        >
            {localButtons.map((group) => {
                if (editMode || !group.empty) {
                    return (
                        <GroupButton
                            key={group.index}
                            group={group}
                            onClick={() => handleGroupButtonClicked(group.index)}
                            editMode={editMode}
                            panelId={panelId}
                            groupType={groupType}
                            onChange={onChange}
                            onEditButtons={handleEditButtonsClicked}
                        />
                    );
                }
            })}
            {editMode && <AddGroupButton onClick={handleAddGroupClicked} />}
        </Box>
    );
}
