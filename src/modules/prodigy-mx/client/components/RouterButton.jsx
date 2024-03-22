import React from "react";
import AxiosCommand from "@utils/AxiosCommand";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugRouterButton from "@core/BugRouterButton";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BackspaceIcon from "@mui/icons-material/Backspace";
import FilterTiltShiftIcon from "@mui/icons-material/FilterTiltShift";
import { useBugCustomDialog } from "@core/BugCustomDialog";
import AddGroupDialog from "./AddGroupDialog";

export default function RouterButton({
    panelId,
    buttonType,
    button,
    onClick,
    selected = false,
    editMode = false,
    disabled = false,
    onChange,
    onEditIcon,
    groups,
    useDoubleClick = false,
    selectedGroup = -1,
}) {
    const { customDialog } = useBugCustomDialog();
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();

    const handleRenameClicked = async (event, item) => {
        const result = await renameDialog({
            title: `Rename ${buttonType}`,
            defaultValue: button.label,
        });
        if (result !== false) {
            if (await AxiosCommand(`/container/${panelId}/${buttonType}/setlabel/${button.index}/${result}`)) {
                sendAlert(`Renamed ${buttonType}: ${button.label} -> ${result}`, { variant: "success" });
            } else {
                sendAlert(`Failed to rename ${buttonType}: ${result}`, { variant: "error" });
            }
            onChange();
        }
    };

    const handleClearClicked = async (event, item) => {
        if (await AxiosCommand(`/container/${panelId}/${buttonType}/setlabel/${button.index}/-`)) {
            sendAlert(`Cleared button label for ${buttonType} ${button.index + 1}`, { variant: "success" });
        } else {
            sendAlert(`Failed to clear label for ${buttonType} ${button.index + 1}`, { variant: "error" });
        }
        onChange();
    };

    const handleRemoveClicked = async (event, item) => {
        const url = `/container/${panelId}/group/button/${buttonType}/${selectedGroup}/${button.index}`;

        if (await AxiosDelete(url)) {
            sendAlert(`Removed ${buttonType} button: ${button.label}`, { variant: "success" });
        } else {
            sendAlert(`Failed to remove ${buttonType} button: ${button.label}`, { variant: "error" });
        }
        onChange();
    };

    const handleAddGroupClicked = async (event) => {
        const groupIndexes = await customDialog({
            dialog: <AddGroupDialog groups={groups.filter((group) => group.fixed === false)} />,
        });
        if (groupIndexes !== false) {
            if (
                await AxiosCommand(
                    `/container/${panelId}/group/addbutton/${buttonType}/${groupIndexes}/${button.index}`
                )
            ) {
                sendAlert(`Added button to group(s) '${groupIndexes.join(",")}'`, { variant: "success" });
                onChange();
            } else {
                sendAlert(`Failed to add button to group(s)`, { variant: "error" });
            }
        }
    };

    const handleClick = (event) => {
        onClick(event);
    };

    return (
        <BugRouterButton
            id={`${buttonType}:${button.index}`}
            draggable
            onClick={handleClick}
            item={button}
            icon={button.icon}
            iconColor={button.iconColor}
            primaryLabel={button.label}
            secondaryLabel={buttonType === "source" ? "" : button.sourceLabel}
            number={button.index + 1}
            selected={selected}
            disabled={disabled}
            editMode={editMode}
            locked={button.isLocked}
            menuItems={[
                {
                    disabled: button.index === -1,
                    title: "Rename",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
                },
                {
                    disabled: button.index === -1,
                    title: "Clear Label",
                    icon: <BackspaceIcon fontSize="small" />,
                    onClick: handleClearClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Edit Icon",
                    icon: <FilterTiltShiftIcon fontSize="small" />,
                    onClick: onEditIcon,
                },
                {
                    title: "Remove",
                    icon: <RemoveCircleIcon fontSize="small" />,
                    onClick: handleRemoveClicked,
                    disabled: button.fixed,
                },
                {
                    title: "-",
                },
                {
                    disabled: button.index === -1,
                    title: "Add to Group",
                    icon: <AddIcon fontSize="small" />,
                    onClick: handleAddGroupClicked,
                },
            ]}
            useDoubleClick={useDoubleClick}
        />
    );
}
