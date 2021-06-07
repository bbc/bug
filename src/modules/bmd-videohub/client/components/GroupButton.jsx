import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import GroupMenu from "./GroupMenu";
import RenameDialog from "./RenameDialog";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: "#5c877c",
        borderRadius: 5,
        margin: 4,
        "&:hover": {
            backgroundColor: "#1d945d",
        },
        width: 128,
        height: 48,
    },
    buttonSelected: {
        backgroundColor: "#33b77a",
        "&:hover": {
            backgroundColor: "#1d945d",
        },
    },
    editButton: {
        borderRadius: 5,
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
}) {
    const sendAlert = useAlert();
    const classes = useStyles();
    const [renameDialogVisible, setRenameDialogVisible] = React.useState(false);

    const handleRenameGroup = async (newGroupName) => {
        if (await AxiosCommand(`/container/${panelId}/groups/rename/${groupType}/${primaryText}/${newGroupName}`)) {
            sendAlert(`Renamed group: ${primaryText} -> ${newGroupName}`, { variant: "success" });
        } else {
            sendAlert(`Failed to rename group: ${primaryText}`, { variant: "error" });
        }
    };

    return (
        <>
            <Button
                className={
                    editMode
                        ? clsx(classes.editButton, {
                              [classes.editButtonSelected]: selected,
                          })
                        : clsx(classes.button, {
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
