import React from "react";
import ButtonMenu from "./ButtonMenu";
import { useSortable } from "@dnd-kit/sortable";
import BugDynamicIcon from "@core/BugDynamicIcon";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useBugRenameDialog } from "@core/BugRenameDialog";

const StyledBugDynamicIcon = styled(BugDynamicIcon)({
    fontSize: "2rem",
    "@media (max-width:800px)": {
        fontSize: 20,
    },
});

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
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: `${buttonType}:${button.index}`,
    });
    const indexPlusOne = (button.index + 1).toString();
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();

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

    const handleRenameClicked = async () => {
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

    let backgroundColor = "#444";
    if (editMode) {
        backgroundColor = "none";
    } else if (selected) {
        backgroundColor = "#337ab7";
    }

    const secondaryText = buttonType === "source" ? "" : button.sourceLabel;
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
                    width: "128px",
                    height: "128px",
                    "@media (max-width:800px)": {
                        height: "80px",
                        width: "92px",
                    },
                    "@media (max-width:600px)": {
                        height: "48px",
                        width: "92px",
                    },
                    textTransform: "none",
                    padding: "0px",
                    lineHeight: editMode ? 1.5 : 1.4,
                    cursor: editMode ? "move" : "pointer",
                    "& .MuiButton-label": {
                        flexDirection: "column",
                        height: "100%",
                    },
                    "&:hover": {
                        backgroundColor: editMode ? "inherit" : "#0069d9",
                    },
                }}
                variant="outlined"
                color="secondary"
                onClick={useDoubleClick ? undefined : onClick}
                onDoubleClick={useDoubleClick ? onClick : undefined}
            >
                <Box
                    className="MuiButton-label"
                    sx={{
                        width: "100%",
                        "@media (max-width:600px)": {
                            padding: "4px",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "65%",
                            "@media (max-width:600px)": {
                                display: "none",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                border: "2px solid #3a3a3a",
                                borderRadius: "100%",
                                height: "64px",
                                width: "64px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                "@media (max-width:800px)": {
                                    height: "36px",
                                    width: "36px",
                                },
                            }}
                        >
                            {button.icon ? (
                                <StyledBugDynamicIcon color={button.iconColour} iconName={button.icon} />
                            ) : (
                                <Box
                                    sx={{
                                        color: "#303030",
                                        fontSize: "28px",
                                        fontWeight: 300,
                                        "@media (max-width:800px)": {
                                            fontSize: "20px",
                                        },
                                    }}
                                >
                                    {indexPlusOne}
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: "100%",
                            backgroundColor: "#333",
                            display: "flex",
                            justifyContent: editMode ? "space-between" : "center",
                            alignItems: "center",
                            height: "35%",
                            flexDirection: editMode ? "row" : "column",
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
                        }}
                    >
                        {editMode ? null : (
                            <Box
                                sx={{
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
                                }}
                            >
                                {secondaryText}
                            </Box>
                        )}
                        <Box
                            sx={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                width: "100%",
                                textAlign: "center",
                                "@media (max-width:800px)": {
                                    fontSize: "12px",
                                },
                                paddingLeft: editMode ? "10px" : "0px",
                            }}
                        >
                            {button.label}
                        </Box>
                        {editMode ? (
                            <ButtonMenu
                                panelId={panelId}
                                buttonType={buttonType}
                                button={button}
                                onChange={onChange}
                                groups={groups}
                                onEditIcon={onEditIcon}
                                onRename={handleRenameClicked}
                            />
                        ) : null}
                    </Box>
                </Box>
            </Button>
        </>
    );
}
