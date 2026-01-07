import BugDragIcon from "@core/BugDragIcon";
import { useSortable } from "@dnd-kit/sortable";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, ListItem, ListItemIcon, ListItemText } from "@mui/material";
export default function EditButtonsDragItem({ button, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: `button:${button.index}`,
        disabled: true,
    });

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
                    minWidth: "32px",
                    padding: "4px",
                }}
            >
                <BugDragIcon />
            </ListItemIcon>
            <Box
                sx={{
                    paddingRight: "8px",
                    fontSize: "17px",
                    marginTop: "1px",
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
