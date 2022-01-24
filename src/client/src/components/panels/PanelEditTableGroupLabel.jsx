import React from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import BugTextField from "@core/BugTextField";
import { useSortable } from "@dnd-kit/sortable";

export default function PanelEditTableGroupLabel({ group, onChange, placeholder, id, passedKey }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id });
    let transformString = null;

    if (transform?.y) {
        transformString = `translateY(${Math.round(transform?.y)}px)`;
    }

    const style = {
        transform: transformString,
        zIndex: 1,
        backgroundColor: "#212121",
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
                backgroundColor: "#212121",
            }}
        >
            <TableCell sx={{ color: "#ccc", textAlign: "center" }}>
                <DragIndicatorIcon />
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
