import BugDragIcon from "@core/BugDragIcon";
import BugTextField from "@core/BugTextField";
import { useSortable } from "@dnd-kit/sortable";
import { TableCell, TableRow } from "@mui/material";

export default function PanelEditTableGroupLabel({ group, onChange, placeholder, id, passedKey }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id });
    let transformString = null;

    if (transform?.y) {
        transformString = `translateY(${Math.round(transform?.y)}px)`;
    }

    const style = {
        transform: transformString,
        zIndex: 1,
        transition,
    };

    if (isDragging) {
        style.boxShadow = "0px 0px 10px 5px #1c1c1c";
    }

    return (
        <TableRow
            hover
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            key={passedKey}
            sx={{
                height: "48px",
                cursor: "move",
                backgroundColor: "background.accent",
            }}
        >
            <TableCell sx={{ textAlign: "center" }}>
                <BugDragIcon />
            </TableCell>
            <TableCell colSpan={6}>
                <BugTextField
                    sx={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "primary.main",
                        "& .MuiInputBase-input": {
                            textTransform: "uppercase",
                            padding: "12px",
                        },
                    }}
                    fullWidth
                    style={{ width: "26rem" }}
                    value={group}
                    filter={(char) => char.replace(":", "")}
                    onChange={(e) => onChange(group, e.target.value)}
                    placeholder={placeholder}
                    type="text"
                    variant="outlined"
                ></BugTextField>
            </TableCell>
        </TableRow>
    );
}
