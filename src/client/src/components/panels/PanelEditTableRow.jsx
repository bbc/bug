import React from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import BugApiSwitch from "@core/BugApiSwitch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useSortable } from "@dnd-kit/sortable";
import PanelPowerIcon from "@components/panels/PanelPowerIcon";
import PanelRowState from "@components/panels/PanelRowState";

export default function PanelEditTableRow({ id, showGroups, panel }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

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
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            key={id}
            sx={{ height: "65px", cursor: "move", backgroundColor: "#262626" }}
        >
            {panel.showGroups ? <TableCell sx={{ width: "0rem" }} /> : null}
            <TableCell sx={{ color: "secondary.main", opacity: 0.3, width: 48, textAlign: "center" }}>
                <DragIndicatorIcon />
            </TableCell>

            <TableCell
                sx={{
                    width: "48px",
                    textAlign: "center",
                }}
            >
                <PanelPowerIcon panel={panel} />
            </TableCell>
            <TableCell sx={{ width: "4rem", textAlign: "center" }}>
                <BugApiSwitch panelId={panel.id} checked={panel.enabled} disabled />
            </TableCell>
            <TableCell>
                <div>{panel.title}</div>
                <PanelRowState panel={panel} />
            </TableCell>
            <TableCell>{panel.description}</TableCell>
            <TableCell>{panel._module.longname}</TableCell>
            <TableCell sx={{ width: "2rem" }}>
                <MoreVertIcon />
            </TableCell>
        </TableRow>
    );
}
