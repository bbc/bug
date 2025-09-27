import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugRouterButton from "@core/BugRouterButton";
import GridViewIcon from "@mui/icons-material/GridView";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAlert } from "@utils/Snackbar";

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
    selectedGroup = "",
}) {
    const { confirmDialog } = useBugConfirmDialog();
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();

    const handleRenameClicked = async (event, item) => {
        // const result = await renameDialog({
        //     title: `Rename ${buttonType}`,
        //     defaultValue: button.label,
        // });
        // if (result !== false) {
        //     if (await AxiosCommand(`/container/${panelId}/setlabel/${button.index}/${buttonType}/${result}`)) {
        //         sendAlert(`Renamed ${buttonType}: ${button.label} -> ${result}`, { variant: "success" });
        //     } else {
        //         sendAlert(`Failed to rename ${buttonType}: ${result}`, { variant: "error" });
        //     }
        //     onChange();
        // }
    };

    const handleClearClicked = async (event, item) => {
        // if (await AxiosCommand(`/container/${panelId}/setlabel/${button.index}/${buttonType}/-`)) {
        //     sendAlert(`Cleared button label for ${buttonType} ${button.index + 1}`, { variant: "success" });
        // } else {
        //     sendAlert(`Failed to clear label for ${buttonType} ${button.index + 1}`, { variant: "error" });
        // }
        // onChange();
    };

    const handleLockClicked = async (event, item) => {
        // let action = "lock";
        // let actionLong = "Locked";
        // if (button.isLocked) {
        //     action = "unlock";
        //     actionLong = "Unlocked";
        //     if (button.isRemoteLocked) {
        //         // we're unlocking and we need to check ...
        //         action = "forceunlock";
        //         if (
        //             !(await confirmDialog({
        //                 title: "Unlock Destination",
        //                 message:
        //                     "This destination has been locked by another user. Are you sure you want to unlock it?",
        //                 confirmButtonText: "Unlock",
        //             }))
        //         ) {
        //             // they've changed their mind ...
        //             return false;
        //         }
        //     }
        // }
        // if (await AxiosCommand(`/container/${panelId}/destinations/${action}/${button.index}`)) {
        //     sendAlert(`${actionLong} ${buttonType} ${button.index + 1}`, {
        //         variant: "success",
        //     });
        // } else {
        //     sendAlert(`Failed to ${action} ${buttonType} ${button.index + 1}`, {
        //         variant: "error",
        //     });
        // }
        // onChange();
    };

    const handleClick = (event) => {
        onClick(event);
    };

    const secondaryLabel = () => {
        if (buttonType === "source") {
            return null;
        }

        const faultyRoute = button.sourceDevice && !button.sourceChannel;
        return (
            <Box
                sx={{
                    width: "118px",
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography
                    sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        opacity: 0.6,
                        textOverflow: "ellipsis",
                        color: faultyRoute ? "warning.main" : "text.primary",
                    }}
                >
                    {button.sourceDevice ? button.sourceDevice : "-"}
                </Typography>
                <Typography
                    sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        fontWeight: 300,
                        fontSize: "0.7rem",
                        opacity: 0.6,
                        textOverflow: "ellipsis",
                    }}
                >
                    {button.sourceChannel ? button.sourceChannel : "-"}
                </Typography>
            </Box>
        );
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
            secondaryLabel={secondaryLabel()}
            number={button.index}
            selected={selected}
            disabled={disabled}
            editMode={editMode}
            locked={button.isLocked}
            wide
            iconSize={buttonType === "source" ? "normal" : "small"}
            leftIcon={
                button.isQuad ? (
                    <GridViewIcon
                        sx={{
                            fontSize: "14px !important",
                        }}
                    />
                ) : null
            }
            menuItems={
                [
                    // {
                    //     title: "Rename",
                    //     icon: <EditIcon fontSize="small" />,
                    //     onClick: handleRenameClicked,
                    // },
                    // {
                    //     title: "Clear Label",
                    //     icon: <BackspaceIcon fontSize="small" />,
                    //     onClick: handleClearClicked,
                    // },
                    // {
                    //     title: "-",
                    // },
                    // {
                    //     title: "Edit Icon",
                    //     icon: <FilterTiltShiftIcon fontSize="small" />,
                    //     onClick: onEditIcon,
                    // },
                    // // {
                    // //     title: "Remove",
                    // //     icon: <RemoveCircleIcon fontSize="small" />,
                    // //     onClick: handleRemoveClicked,
                    // //     disabled: groups.length === 0,
                    // // },
                    // {
                    //     title: "-",
                    // },
                    // {
                    //     title: "Lock",
                    //     disabled: buttonType !== "destination",
                    //     icon: (item) => (item.isLocked ? <CheckIcon fontSize="small" /> : null),
                    //     onClick: handleLockClicked,
                    // },
                    // {
                    //     title: "Quad",
                    //     disabled: button.index % 4 !== 0,
                    //     icon: (item) => (item.isQuad ? <CheckIcon fontSize="small" /> : null),
                    //     onClick: handleQuadClicked,
                    // },
                    // {
                    //     title: "-",
                    // },
                    // {
                    //     title: "Add to Group",
                    //     icon: <AddIcon fontSize="small" />,
                    //     onClick: handleAddGroupClicked,
                    //     disabled: groups.length === 0,
                    // },
                ]
            }
            useDoubleClick={useDoubleClick}
        />
    );
}
