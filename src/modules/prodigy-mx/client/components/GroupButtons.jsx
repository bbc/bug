import React, { useEffect, useState } from "react";
import BugLoading from "@core/BugLoading";
import { useAlert } from "@utils/Snackbar";
import GroupButton from "./GroupButton";
import AddGroupButton from "./AddGroupButton";
import AxiosPost from "@utils/AxiosPost";
import { useHistory } from "react-router-dom";
import EditButtonsDialog from "./EditButtonsDialog";
import Box from "@mui/material/Box";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import { useBugCustomDialog } from "@core/BugCustomDialog";

export default function GroupButtons({
    panelId,
    editMode = false,
    groupType,
    buttons,
    onChange,
    destinationGroup,
    sourceGroup,
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
            history.push(`/panel/${panelId}${editText}/display/router/${groupIndex}/${destinationGroup}`);
        } else {
            history.push(`/panel/${panelId}${editText}/display/router/${sourceGroup}/${groupIndex}`);
        }
    };

    const handleAddGroupClicked = async (event) => {
        const result = await renameDialog({
            title: "Add group",
            defaultValue: "",
            confirmButtonText: "Add",
        });
        if (result !== false) {
            if (await AxiosPost(`/container/${panelId}/group/${groupType}/${result}`)) {
                sendAlert(`Added group: ${result}`, { variant: "success" });
                onChange();
            } else {
                sendAlert(`Failed to add group: ${result}`, { variant: "error" });
            }
        }
    };

    const handleEditButtonsClicked = async (event, item) => {
        const result = await customDialog({
            dialog: <EditButtonsDialog panelId={panelId} groupType={groupType} groupIndex={item.index} />,
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
            {localButtons.map((group) => (
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
            ))}
            {editMode && <AddGroupButton onClick={handleAddGroupClicked} />}
        </Box>
    );
}
