import React from "react";
import GroupMenu from "./GroupMenu";
import RenameDialog from "./RenameDialog";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useSortable } from "@dnd-kit/sortable";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function GroupButton({
    panelId,
    selected = false,
    index,
    primaryText,
    onClick,
    groupType,
    editMode = false,
    onChange,
    onEditButtons,
}) {
    const sendAlert = useAlert();
    const [renameDialogVisible, setRenameDialogVisible] = React.useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: primaryText });

    let transformString = null;

    if (transform?.x) {
        transformString = `translateX(${Math.round(transform?.x)}px)`;
    }

    const style = {
        transform: transformString,
        transition,
    };

    const handleRenameGroup = async (newGroupName) => {
        setRenameDialogVisible(false);
        if (await AxiosCommand(`/container/${panelId}/groups/rename/${groupType}/${primaryText}/${newGroupName}`)) {
            sendAlert(`Renamed group: ${primaryText} -> ${newGroupName}`, { variant: "success" });
        } else {
            sendAlert(`Failed to rename group: ${primaryText}`, { variant: "error" });
        }
        onChange();
    };

    // bg color:
    let backgroundColor = "#444";
    if (editMode) {
        backgroundColor = "none";
    } else if (selected) {
        backgroundColor = "#337ab7";
    }

    // border color
    let borderColor = "rgba(136, 136, 136, 0.5)";
    if (editMode && selected) {
        borderColor = "#33b77a";
    }

    return (
        <>
            <Button
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                sx={{
                    backgroundColor: backgroundColor,
                    margin: "4px",
                    flexDirection: "row",
                    justifyContent: editMode ? "space-between" : "center",
                    width: 128,
                    height: 48,
                    "@media (max-width:800px)": {
                        height: 36,
                        width: 92,
                    },
                    padding: 0,
                    borderColor: borderColor,
                    textAlign: "center",
                    color: "#fff",
                }}
                onClick={onClick}
                variant="outlined"
                color="secondary"
            >
                <Box
                    sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        "@media (max-width:800px)": {
                            fontSize: 12,
                        },
                        paddingLeft: editMode ? "10px" : 0,
                    }}
                >
                    {primaryText}
                </Box>
                {editMode ? (
                    <GroupMenu
                        panelId={panelId}
                        groupType={groupType}
                        groupName={primaryText}
                        groupIndex={index}
                        onRename={() => setRenameDialogVisible(true)}
                        onChange={onChange}
                        onEditButtons={onEditButtons}
                    />
                ) : null}
            </Button>
            {renameDialogVisible && (
                <RenameDialog
                    title="Rename group"
                    label="Group name"
                    panelId={panelId}
                    defaultValue={primaryText}
                    onCancel={() => setRenameDialogVisible(false)}
                    onSubmit={handleRenameGroup}
                    buttonText="Rename"
                />
            )}
        </>
    );
}
