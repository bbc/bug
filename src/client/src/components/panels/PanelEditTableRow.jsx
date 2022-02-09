import React from "react";
import BugDragIcon from "@core/BugDragIcon";
import BugApiSwitch from "@core/BugApiSwitch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useSortable } from "@dnd-kit/sortable";
import PanelPowerIcon from "@components/panels/PanelPowerIcon";
import PanelRowState from "@components/panels/PanelRowState";

export default function PanelEditTableRow({ id, panel }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id });
    let transformString = null;

    if (transform?.y) {
        transformString = `translateY(${Math.round(transform?.y)}px)`;
    }

    const style = {
        transform: transformString,
        transition,
    };

    if (isDragging) {
        style.backgroundColor = "#337ab7";
        style.boxShadow = "0px 0px 30px 5px #202020";
    }

    const opacity = isDragging ? 1 : 0.5;

    return (
        <TableRow
            hover
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            key={id}
            sx={{ height: "65px", cursor: "move", backgroundColor: "#262626" }}
        >
            <TableCell sx={{ textAlign: "center" }}>
                <BugDragIcon />
            </TableCell>

            <TableCell
                sx={{
                    width: "48px",
                    textAlign: "center",
                }}
            >
                <PanelPowerIcon panel={panel} />
            </TableCell>
            <TableCell sx={{ textAlign: "center", opacity: opacity }}>
                <BugApiSwitch checked={panel.enabled} disabled />
            </TableCell>
            <TableCell sx={{ width: "50%", opacity: opacity }}>
                <div>{panel.title}</div>
                <PanelRowState panel={panel} />
            </TableCell>
            <TableCell sx={{ width: "50%", opacity: opacity }}>{panel._module.longname}</TableCell>
            <TableCell sx={{ width: "48px", opacity: opacity }}>
                <MoreVertIcon />
            </TableCell>
        </TableRow>
    );
}
