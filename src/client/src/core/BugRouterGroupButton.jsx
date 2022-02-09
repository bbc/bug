import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import BugItemMenu from "@components/BugItemMenu";
import { useSortable } from "@dnd-kit/sortable";

export default function GroupButton({
    onClick,
    item,
    primaryLabel,
    draggable = false,
    selected = false,
    id,
    editMode = false,
    menuItems,
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

    let transformString = null;

    const style = {
        transform: transformString,
        transition,
    };

    if (transform?.x) {
        style.transform = `translateX(${Math.round(transform?.x)}px)`;
        style.zIndex = 9999;
        style.backgroundColor = "#262626";
    }

    let borderColor = "rgba(136, 136, 136, 0.5)";
    if (editMode && selected) {
        borderColor = "#33b77a";
    }

    const extraProps = draggable ? { ...attributes, ...listeners, style: style } : {};

    return (
        <>
            <Button
                ref={setNodeRef}
                {...extraProps}
                sx={{
                    backgroundColor: editMode ? "none" : selected ? "primary.main" : "tertiary.main",
                    margin: "4px",
                    flexDirection: "row",
                    justifyContent: editMode ? "space-between" : "center",
                    width: "128px",
                    height: "48px",
                    "@media (max-width:800px)": {
                        height: "36px",
                        width: "92px",
                    },
                    padding: "0px 5px",
                    borderColor: borderColor,
                    textAlign: "center",
                    color: "#fff",
                    cursor: editMode ? (draggable ? "move" : "default") : "pointer",
                    "&:hover": {
                        backgroundColor: editMode ? "inherit" : selected ? "primary.hover" : "tertiary.hover",
                    },
                }}
                onClick={onClick}
                variant="outlined"
                color="secondary"
            >
                <Box
                    sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        "@media (max-width:800px)": {
                            fontSize: 12,
                        },
                        paddingLeft: editMode ? "10px" : "0px",
                    }}
                >
                    {primaryLabel}
                </Box>
                {editMode && menuItems && <BugItemMenu item={item} menuItems={menuItems} />}
            </Button>
        </>
    );
}
