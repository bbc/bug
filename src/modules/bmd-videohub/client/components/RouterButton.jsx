import React from "react";
import AxiosCommand from "@utils/AxiosCommand";
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
    selected,
    editMode = false,
    onChange,
    onEditIcon,
    groups,
    useDoubleClick = false,
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
            if (await AxiosCommand(`/container/${panelId}/setlabel/${button.index}/${buttonType}/${result}`)) {
                sendAlert(`Renamed ${buttonType}: ${button.label} -> ${result}`, { variant: "success" });
            } else {
                sendAlert(`Failed to rename ${buttonType}: ${result}`, { variant: "error" });
            }
            onChange();
        }
    };

    const handleClearClicked = async (event, item) => {
        if (await AxiosCommand(`/container/${panelId}/setlabel/${button.index}/${buttonType}/-`)) {
            sendAlert(`Cleared button label for ${buttonType} ${button.index + 1}`, { variant: "success" });
        } else {
            sendAlert(`Failed to clear label for ${buttonType} ${button.index + 1}`, { variant: "error" });
        }
        onChange();
    };

    const handleRemoveClicked = async (event, item) => {
        const url =
            buttonType === "source"
                ? `/container/${panelId}/${buttonType}s/${sourceGroup}/${button.index}`
                : `/container/${panelId}/${buttonType}s/${destinationGroup}/${button.index}`;

        if (!(await AxiosDelete(url))) {
            sendAlert(`Failed to delete button`, { variant: "error" });
        }
        onChange();
    };

    const handleAddGroupClick = async (event) => {
        const groupIndexes = await customDialog({
            dialog: <AddGroupDialog groups={groups} />,
        });
        if (groupIndexes !== false) {
            if (
                await AxiosCommand(
                    `/container/${panelId}/groups/addbutton/${buttonType}/${groupIndexes}/${button.index}`
                )
            ) {
                sendAlert(`Added button to group(s) '${groupIndexes.join(",")}'`, { variant: "success" });
                onChange();
            } else {
                sendAlert(`Failed to add button to group(s)`, { variant: "error" });
            }
        }
    };

    return (
        <BugRouterButton
            id={`${buttonType}:${button.index}`}
            draggable
            onClick={onClick}
            item={button}
            icon={button.icon}
            iconColor={button.iconColour}
            primaryLabel={button.label}
            secondaryLabel={buttonType === "source" ? "" : button.sourceLabel}
            number={button.index + 1}
            selected={selected}
            editMode={editMode}
            menuItems={[
                {
                    title: "Rename",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
                },
                {
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
                    disabled: groups.length === 0,
                },
                {
                    title: "-",
                },
                {
                    title: "Add to Group",
                    icon: <AddIcon fontSize="small" />,
                    onClick: handleAddGroupClick,
                    disabled: groups.length === 0,
                },
            ]}
            useDoubleClick={useDoubleClick}
        />
    );
}
