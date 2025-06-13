import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useBugCustomDialog } from "@core/BugCustomDialog";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugRouterButton from "@core/BugRouterButton";
import AddIcon from "@mui/icons-material/Add";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import FilterTiltShiftIcon from "@mui/icons-material/FilterTiltShift";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AxiosCommand from "@utils/AxiosCommand";
import AxiosDelete from "@utils/AxiosDelete";
import { useAlert } from "@utils/Snackbar";
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
    const { confirmDialog } = useBugConfirmDialog();
    const { customDialog } = useBugCustomDialog();
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();

    const handleRenameClicked = async (event, item) => {
        const result = await renameDialog({
            title: `Rename ${buttonType}`,
            defaultValue: button.label,
        });
        if (result !== false) {
            if (
                await AxiosCommand(
                    `/container/${panelId}/${buttonType}s/setlabel/${button.index}/${encodeURIComponent(result)}`
                )
            ) {
                sendAlert(`Renamed ${buttonType}: ${button.label} -> ${result}`, { variant: "success" });
            } else {
                sendAlert(`Failed to rename ${buttonType}: ${result}`, { variant: "error" });
            }
            onChange();
        }
    };

    const handleClearClicked = async (event, item) => {
        const defaultLabel = `${buttonType} ${button.index}`;
        if (
            await AxiosCommand(
                `/container/${panelId}/${buttonType}s/setlabel/${button.index}/${encodeURIComponent(defaultLabel)}`
            )
        ) {
            sendAlert(`Cleared button label for ${buttonType} ${button.index}`, { variant: "success" });
        } else {
            sendAlert(`Failed to clear label for ${buttonType} ${button.index}`, { variant: "error" });
        }
        onChange();
    };

    const handleRemoveClicked = async (event, item) => {
        const groupId = groups[selectedGroup]?.id;
        const url = `/container/${panelId}/${buttonType}s/${groupId}/${encodeURIComponent(button.label)}`;

        if (await AxiosDelete(url)) {
            sendAlert(`Removed ${buttonType} button: ${button.label}`, { variant: "success" });
        } else {
            sendAlert(`Failed to remove ${buttonType} button: ${button.label}`, { variant: "error" });
        }
        onChange();
    };

    const handleLockClicked = async (event, item) => {
        let action = "lock";
        let actionLong = "Locked";

        if (button.isLocked) {
            action = "unlock";
            actionLong = "Unlocked";
        }

        if (await AxiosCommand(`/container/${panelId}/destinations/${action}/${button.index}`)) {
            sendAlert(`${actionLong} ${buttonType} ${button.index + 1}`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to ${action} ${buttonType} ${button.index + 1}`, {
                variant: "error",
            });
        }
        onChange();
    };

    const handleAddGroupClicked = async (event) => {
        console.log(groups);
        const groupIds = await customDialog({
            dialog: <AddGroupDialog groups={groups.filter((group) => group.fixed === false)} />,
        });
        if (groupIds !== false) {
            if (
                await AxiosCommand(`/container/${panelId}/groups/addbuttons/${buttonType}/${groupIds}/${button.index}`)
            ) {
                sendAlert(`Added button to group(s) '${groupIds.join(",")}'`, { variant: "success" });
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
            secondaryLabel={buttonType === "source" ? "" : button.sourceLabel ? button.sourceLabel : "-"}
            tertiaryLabel={button.description}
            number={button.index + 1}
            selected={selected}
            disabled={disabled}
            editMode={editMode}
            locked={button.isLocked}
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
                    disabled: button.fixed,
                },
                {
                    title: "-",
                },
                {
                    title: "Lock",
                    disabled: buttonType !== "destination",
                    icon: (item) => (item.isLocked ? <CheckIcon fontSize="small" /> : null),
                    onClick: handleLockClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Add to Group",
                    icon: <AddIcon fontSize="small" />,
                    onClick: handleAddGroupClicked,
                    disabled: groups.length === 0,
                },
            ]}
            useDoubleClick={useDoubleClick}
        />
    );
}
