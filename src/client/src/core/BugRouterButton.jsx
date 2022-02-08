import React from "react";
import BugDynamicIcon from "@core/BugDynamicIcon";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import BugItemMenu from "@components/BugItemMenu";
import { useSortable } from "@dnd-kit/sortable";
import LockIcon from "@mui/icons-material/Lock";

const StyledBugDynamicIcon = styled(BugDynamicIcon)({
    fontSize: "2rem",
    "@media (max-width:800px)": {
        fontSize: 20,
    },
});

const BugRouterButton = ({
    onClick,
    item,
    icon = null,
    iconColor = null,
    primaryLabel,
    secondaryLabel,
    number,
    draggable = false,
    selected,
    id,
    editMode = false,
    locked = false,
    disabled = false,
    menuItems,
    useDoubleClick = false,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: id,
    });

    let style = {
        transform: "",
        transition,
    };

    if (transform?.x) {
        style.transform += `translateX(${Math.round(transform?.x)}px)`;
    }
    if (transform?.y) {
        style.transform += ` translateY(${Math.round(transform?.y)}px)`;
    }
    if (transform?.x || transform?.y) {
        style.zIndex = 9999;
        style.backgroundColor = "#262626";
    }

    const extraProps = draggable ? { ...attributes, ...listeners, style: style } : {};

    return (
        <Button
            ref={setNodeRef}
            {...extraProps}
            sx={{
                backgroundColor: editMode ? "none" : selected ? "primary.main" : "tertiary.main",
                margin: "4px",
                width: "128px",
                height: "128px",
                "@media (max-width:800px)": {
                    height: "80px",
                    width: "92px",
                    color: "#ffffff",
                },
                "@media (max-width:600px)": {
                    height: "48px",
                    width: "92px",
                },
                textTransform: "none",
                padding: "0px",
                lineHeight: editMode ? 1.5 : 1.4,
                cursor: disabled ? "not-allowed" : editMode ? (draggable ? "move" : "default") : "pointer",
                "& .MuiButton-label": {
                    flexDirection: "column",
                    height: "100%",
                },
                "&:hover": {
                    backgroundColor: editMode ? "inherit" : selected ? "primary.hover" : "tertiary.hover",
                },
            }}
            variant="outlined"
            color="secondary"
            onClick={disabled ? undefined : useDoubleClick ? undefined : onClick}
            onDoubleClick={disabled ? undefined : useDoubleClick ? onClick : undefined}
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
                {locked && (
                    <LockIcon
                        sx={{
                            position: "absolute",
                            right: "0px",
                            top: "0px",
                            fontSize: "12px !important",
                            margin: "4px",
                            color: editMode ? "#fff" : "#212121",
                        }}
                    />
                )}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "65%",
                        "@media (max-width:800px)": {
                            height: "56%",
                        },
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
                        {icon ? (
                            <StyledBugDynamicIcon color={iconColor} iconName={icon} />
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
                                {number}
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
                        padding: "0 4px",
                        "@media (max-width:800px)": {
                            height: "44%",
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
                            {secondaryLabel}
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
                        {primaryLabel}
                    </Box>
                    {editMode && menuItems && <BugItemMenu item={item} menuItems={menuItems} />}
                </Box>
            </Box>
        </Button>
    );
};

export default BugRouterButton;
