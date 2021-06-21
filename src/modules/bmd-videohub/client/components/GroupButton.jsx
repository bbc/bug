import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import GroupMenu from "./GroupMenu";
import RenameDialog from "./RenameDialog";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useSortable } from "@dnd-kit/sortable";

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: "#444",
        borderRadius: 3,
        margin: 4,
        "&:hover": {
            backgroundColor: "#0069d9",
        },
        width: 128,
        height: 48,
        "@media (max-width:800px)": {
            height: 36,
            width: 92,
        },
    },
    buttonSelected: {
        backgroundColor: "#337ab7",
        "&:hover": {
            backgroundColor: "#0069d9",
        },
    },
    editButton: {
        borderRadius: 3,
        margin: 4,
        padding: 0,
        width: 128,
        height: 48,
        flexDirection: "row",
        justifyContent: "space-between",
        "&:hover": {
            backgroundColor: "none",
        },
    },
    editButtonSelected: {
        borderColor: "#33b77a",
    },
    primaryText: {
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        "@media (max-width:800px)": {
            fontSize: 12,
        },
    },
    primaryTextEdit: {
        paddingLeft: 10,
    },
}));

export default function GroupButton({
    panelId,
    selected = false,
    index,
    primaryText,
    icon = null,
    onClick,
    groupType,
    editMode = false,
    onChange,
    onEditButtons,
}) {
    const sendAlert = useAlert();
    const classes = useStyles();
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

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className={
                    editMode
                        ? clsx("MuiButtonBase-root", "MuiButton-root", "MuiButton-outlined", classes.editButton, {
                              [classes.editButtonSelected]: selected,
                          })
                        : clsx("MuiButtonBase-root", "MuiButton-root", "MuiButton-outlined", classes.button, {
                              [classes.buttonSelected]: selected,
                          })
                }
                onClick={onClick}
                variant="outlined"
            >
                <div
                    className={clsx(classes.primaryText, {
                        [classes.primaryTextEdit]: editMode,
                    })}
                >
                    {primaryText}
                </div>
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
            </div>
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
