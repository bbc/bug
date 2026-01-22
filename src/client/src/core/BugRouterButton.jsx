import BugItemMenu from "@components/BugItemMenu";
import BugContextMenu from "@core/BugContextMenu";
import BugCountdownSpinner from "@core/BugCountdownSpinner";
import BugDynamicIcon from "@core/BugDynamicIcon";
import { useSortable } from "@dnd-kit/sortable";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useLongPress } from "use-long-press";
const StyledBugDynamicIcon = styled(BugDynamicIcon)({
    fontSize: "2rem",
    "@media (max-width:800px)": {
        fontSize: 20,
    },
});

const BugRouterButton = ({
    disabled = false,
    draggable = false,
    editMode = false,
    id,
    icon = null,
    iconColor = null,
    item,
    locked = false,
    leftIcon = null,
    menuItems = [],
    number,
    onClick,
    primaryLabel,
    secondaryLabel,
    tertiaryLabel,
    iconSize = "medium",
    selected,
    useDoubleClick = false,
    sx = {},
    wide = false,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: id,
    });
    const timer = React.useRef();
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = React.useState(null);

    const bind = useLongPress((event) => {
        setContextMenuAnchorEl(event.target);
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

    const [isWaitingForConfirmation, setIsWaitingForConfirmation] = React.useState(false);

    const onConfirmClick = () => {
        if (isWaitingForConfirmation) {
            setIsWaitingForConfirmation(false);
            onClick();
        } else {
            setIsWaitingForConfirmation(true);
            timer.current = setTimeout(() => {
                setIsWaitingForConfirmation(false);
            }, 3000);
        }
    };

    const handleClick = () => {
        if (disabled) {
            return;
        }
        if (editMode) {
            return onClick();
        }
        if (selected) {
            return false;
        }
        if (useDoubleClick) {
            return onConfirmClick();
        } else {
            return onClick();
        }
    };

    // if tertiary label is set, we should reduce the size of the icon
    if (tertiaryLabel) {
        iconSize = "small";
    }

    let fontSize = number?.toString().length > 3 ? 22 : 28;
    if (iconSize === "small") {
        fontSize -= 8;
    }

    const SecondaryLabel = ({ content }) => {
        if (React.isValidElement(content)) {
            // JSX element
            return content;
        }

        if (typeof content === "function") {
            // Component type (function or class)
            const Component = content;
            return <Component />;
        }

        if (typeof content === "string") {
            return (
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
                    {content}
                </Box>
            );
        }

        return null;
    };

    return (
        <Button
            component="div"
            ref={setNodeRef}
            {...extraProps}
            sx={{
                borderWidth: "1px",
                borderStyle: isWaitingForConfirmation ? "dashed" : "solid",
                borderColor: isWaitingForConfirmation ? "primary.main" : "rgba(136, 136, 136, 0.5)",
                backgroundColor: editMode ? "none" : selected ? "primary.main" : "tertiary.main",
                margin: "4px",
                width: wide ? "160px" : "128px",
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
                    borderStyle: isWaitingForConfirmation ? "dashed" : "solid",
                    borderColor: isWaitingForConfirmation ? "primary.main" : "rgba(136, 136, 136, 0.5)",
                    backgroundColor: editMode ? "inherit" : selected ? "primary.hover" : "tertiary.hover",
                },
                WebkitTouchCallout: "none !important",
                WebkitUserSelect: "none !important",
                color: "text.primary",
                ...sx,
            }}
            variant="outlined"
            onClick={handleClick}
            {...bind()}
            onContextMenu={(e) => {
                e.preventDefault();
            }}
        >
            {!editMode && (
                <BugContextMenu
                    anchorEl={contextMenuAnchorEl}
                    onClose={() => setContextMenuAnchorEl(null)}
                    item={item}
                    menuItems={menuItems}
                />
            )}
            <Box
                className="MuiButton-label"
                sx={{
                    height: "100%",
                    width: "100%",
                    "@media (max-width:600px)": {
                        padding: "4px",
                    },
                    display: "flex",
                }}
            >
                {locked && (
                    <LockIcon
                        sx={{
                            position: "absolute",
                            right: "0px",
                            top: "0px",
                            fontSize: "14px !important",
                            margin: "4px",
                            color: editMode ? "#fff" : "#ccc",
                        }}
                    />
                )}
                {leftIcon && (
                    <Box
                        sx={{
                            position: "absolute",
                            left: "0px",
                            top: "0px",
                            margin: "4px",
                            color: editMode ? "#fff" : "#ccc",
                        }}
                    >
                        {leftIcon}
                    </Box>
                )}
                {tertiaryLabel && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "15%",
                            color: editMode ? "text.primary" : selected ? "#303030" : "primary.main",
                            "@media (max-width:800px)": {
                                display: "none",
                            },
                            textTransform: "uppercase",
                            paddingTop: "4px",
                            fontSize: "12px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {tertiaryLabel}
                    </Box>
                )}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: iconSize === "small" ? "42%" : "65%",
                        "@media (max-width:800px)": {
                            height: "56%",
                        },
                        "@media (max-width:600px)": {
                            display: "none",
                        },
                        paddingBottom: iconSize === "small" ? "4px" : 0,
                    }}
                >
                    <Box
                        sx={{
                            border: "2px solid #3a3a3a",
                            borderRadius: "100%",
                            height: iconSize === "small" ? "48px" : "64px",
                            width: iconSize === "small" ? "48px" : "64px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            "@media (max-width:800px)": {
                                height: "36px",
                                width: "36px",
                            },
                        }}
                    >
                        {isWaitingForConfirmation ? (
                            <BugCountdownSpinner duration={3000} />
                        ) : icon ? (
                            <StyledBugDynamicIcon color={iconColor} iconName={icon} />
                        ) : (
                            <Box
                                sx={{
                                    color: "#303030",
                                    fontSize: `${fontSize}px`,
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
                        flexGrow: 1,
                        boxSizing: "border-box",
                        width: "100%",
                        backgroundColor: "#333",
                        display: "flex",
                        justifyContent: editMode ? "space-between" : "center",
                        alignItems: "center",
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
                    {editMode ? null : <SecondaryLabel content={secondaryLabel} />}
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
