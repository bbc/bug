import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import BugDragIcon from "@core/BugDragIcon";
import { useSortable } from "@dnd-kit/sortable";

export default function SecurityTableRow({ strategy, index }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: strategy.type });

    let transformString = null;

    if (transform?.y) {
        transformString = `translateY(${Math.round(transform?.y)}px)`;
    }

    const style = {
        transform: transformString,
        transition,
    };

    return (
        <TableRow
            key={strategy.type}
            hover
            sx={{
                cursor: "grab",
                height: "55px",
            }}
            index={index}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <TableCell
                sx={{
                    width: "82px",
                }}
            >
                <BugDragIcon />
            </TableCell>
            <TableCell>{strategy.name}</TableCell>
            <TableCell
                sx={{
                    "@media (max-width:512px)": {
                        display: "none",
                    },
                }}
            >
                {strategy.type.toUpperCase()}
            </TableCell>
            <TableCell
                sx={{
                    "@media (max-width:1024px)": {
                        display: "none",
                    },
                }}
            >
                {strategy.description}
            </TableCell>
            <TableCell sx={{ width: "1rem" }}></TableCell>
        </TableRow>
    );
}
