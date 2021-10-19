import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useSortable } from "@dnd-kit/sortable";
import Box from "@mui/material/Box";

export default function EditButtonsDragItem({ button, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `button:${button.index}` });

    let transformString = null;

    if (transform?.y) {
        transformString = `translateY(${Math.round(transform?.y)}px)`;
    }

    const style = {
        transform: transformString,
        transition,
    };

    return (
        <ListItem
            sx={{
                borderBottom: "1px solid #282828",
                height: "51px",
                cursor: "move",
                paddingLeft: "8px",
                paddingRight: "8px",
            }}
            key={button.index}
            role="listitem"
            button
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <ListItemIcon
                sx={{
                    opacity: 0.6,
                    color: "primary.main",
                    minWidth: "32px",
                    padding: "4px",
                }}
            >
                <DragIndicatorIcon fontSize="small" />
            </ListItemIcon>
            <Box
                sx={{
                    paddingRight: "8px",
                    fontWeight: 900,
                    opacity: 0.3,
                }}
            >
                {button.index + 1}
            </Box>
            <ListItemText
                primary={button.label}
                sx={{
                    opacity: button.hidden ? 0.3 : 1,
                }}
            />
            <IconButton onClick={() => onRemove(button.index)} sx={{ opacity: 0.7 }}>
                <CloseIcon />
            </IconButton>
        </ListItem>
    );
}
