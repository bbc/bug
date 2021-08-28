import React from "react";
import ButtonMenu from "./ButtonMenu";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import DynamicIcon from "@core/DynamicIcon";
import RenameDialog from "./RenameDialog";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";

const useStyles = makeStyles((theme) => ({
    editButton: {
        borderRadius: 3,
        margin: 4,
        width: 128,
        height: 128,
        padding: 0,
        textTransform: "none",
        lineHeight: 1.4,
        cursor: "move",
        "& .MuiButton-label": {
            flexDirection: "column",
            height: "100%",
        },
        "&:hover": {
            backgroundColor: "inherit",
        },
        "@media (max-width:600px)": {
            height: 48,
        },
    },
    buttonIcon: {
        fontSize: "2rem",
        "@media (max-width:800px)": {
            fontSize: 20,
        },
    },
    button: {
        backgroundColor: "#444",
        borderRadius: 3,
        margin: 4,
        "&:hover": {
            backgroundColor: "#0069d9",
        },
        width: 128,
        height: 128,
        padding: 0,
        textTransform: "none",
        lineHeight: 1.4,
        "& .MuiButton-label": {
            flexDirection: "column",
            height: "100%",
        },
        "@media (max-width:800px)": {
            height: 80,
            width: 92,
        },
        "@media (max-width:600px)": {
            height: 48,
            width: 92,
        },
    },
    buttonSelected: {
        backgroundColor: "#337ab7",
        "&:hover": {
            backgroundColor: "#0069d9",
        },
    },
    buttonLabel: {
        width: "100%",
        "@media (max-width:600px)": {
            padding: 4,
        },
    },
    buttonUpper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "65%",
        "@media (max-width:600px)": {
            display: "none",
        },
    },
    secondaryText: {
        fontWeight: 500,
        fontSize: "0.7rem",
        opacity: 0.6,
        textOverflow: "ellipsis",
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textAlign: "center",
        "@media (max-width:800px)": {
            fontSize: 10,
        },
    },
    buttonLower: {
        width: "100%",
        backgroundColor: "#333",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "35%",
        flexDirection: "column",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        padding: "0 8px",
        "@media (max-width:800px)": {
            height: "50%",
            padding: "0 4px",
        },
        "@media (max-width:600px)": {
            backgroundColor: "inherit",
            height: "100%",
        },
    },
    buttonLowerEdit: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    circle: {
        border: "2px solid #3a3a3a",
        borderRadius: "100%",
        height: 64,
        width: 64,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "@media (max-width:800px)": {
            height: 36,
            width: 36,
        },
    },
    index: {
        color: "#303030",
        fontSize: 28,
        fontWeight: 300,
        "@media (max-width:800px)": {
            fontSize: 20,
        },
    },
    primaryText: {
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "100%",
        textAlign: "center",
        "@media (max-width:800px)": {
            fontSize: 12,
        },
    },
    primaryTextEdit: {
        paddingLeft: 10,
    },
}));

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
    const classes = useStyles();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: `${buttonType}:${button.index}`,
    });
    const indexPlusOne = (button.index + 1).toString();
    const [renameDialogVisible, setRenameDialogVisible] = React.useState(false);
    const sendAlert = useAlert();

    let transformString = "";

    if (transform?.x) {
        transformString += `translateX(${Math.round(transform?.x)}px)`;
    }
    if (transform?.y) {
        transformString += ` translateY(${Math.round(transform?.y)}px)`;
    }

    const style = {
        transform: transformString,
        transition,
    };

    const handleRename = async (newName) => {
        setRenameDialogVisible(false);
        if (await AxiosCommand(`/container/${panelId}/setlabel/${button.index}/${buttonType}/${newName}`)) {
            sendAlert(`Renamed ${buttonType}: ${button.label} -> ${newName}`, { variant: "success" });
        } else {
            sendAlert(`Failed to rename ${buttonType}: ${newName}`, { variant: "error" });
        }
        onChange();
    };

    const secondaryText = buttonType === "source" ? "" : button.sourceLabel;
    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className={
                    editMode
                        ? clsx("MuiButtonBase-root", "MuiButton-root", "MuiButton-outlined", classes.editButton)
                        : clsx("MuiButtonBase-root", "MuiButton-root", "MuiButton-outlined", classes.button, {
                              [classes.buttonSelected]: selected,
                          })
                }
                variant="outlined"
                onClick={useDoubleClick ? undefined : onClick}
                onDoubleClick={useDoubleClick ? onClick : undefined}
            >
                <div className={clsx("MuiButton-label", classes.buttonLabel)}>
                    <div className={classes.buttonUpper}>
                        <div className={classes.circle}>
                            {button.icon ? (
                                <DynamicIcon
                                    color={button.iconColour}
                                    className={classes.buttonIcon}
                                    iconName={button.icon}
                                />
                            ) : (
                                <div className={classes.index}>{indexPlusOne}</div>
                            )}
                        </div>
                    </div>
                    <div
                        className={clsx(classes.buttonLower, {
                            [classes.buttonLowerEdit]: editMode,
                        })}
                    >
                        {editMode ? null : <div className={classes.secondaryText}>{secondaryText}</div>}
                        <div
                            className={clsx(classes.primaryText, {
                                [classes.primaryTextEdit]: editMode,
                            })}
                        >
                            {button.label}
                        </div>
                        {editMode ? (
                            <ButtonMenu
                                panelId={panelId}
                                buttonType={buttonType}
                                button={button}
                                onChange={onChange}
                                groups={groups}
                                onEditIcon={onEditIcon}
                                onRename={() => setRenameDialogVisible(true)}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
            {renameDialogVisible && (
                <RenameDialog
                    title={`Rename ${buttonType}`}
                    label="Name"
                    panelId={panelId}
                    defaultValue={button.label}
                    onCancel={() => setRenameDialogVisible(false)}
                    onSubmit={handleRename}
                    buttonText="Rename"
                />
            )}
        </>
    );
}
