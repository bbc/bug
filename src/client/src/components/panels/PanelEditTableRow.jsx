import React from "react";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { makeStyles } from "@material-ui/core/styles";
import ApiSwitch from "@core/ApiSwitch";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { useSortable } from "@dnd-kit/sortable";
import PanelPowerIcon from "@components/panels/PanelPowerIcon";
import PanelRowState from "@components/panels/PanelRowState";

const useStyles = makeStyles((theme) => ({
    cellMenu: {
        width: "2rem",
    },
    disabledText: {
        opacity: 0.3,
    },
    colDrag: {
        color: theme.palette.secondary.main,
        opacity: 0.3,
        width: 48,
        textAlign: "center",
    },
    colPower: {
        width: 48,
        textAlign: "center",
    },
    colDescription: {
        "@media (max-width:1024px)": {
            display: "none",
        },
    },
    colModule: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colIndent: {
        width: "0rem",
    },
    colEnabled: {
        width: "4rem",
    },
    panelRow: {
        height: 65,
        cursor: "move",
        backgroundColor: "#262626",
    },
}));

export default function PanelEditTableRow({ id, showGroups, panel }) {
    const classes = useStyles();

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
            key={`${panel.group}:${panel.id}`}
            className={classes.panelRow}
        >
            {panel.showGroups ? <TableCell className={classes.colIndent} /> : null}
            <TableCell className={classes.colDrag}>
                <DragIndicatorIcon />
            </TableCell>

            <TableCell className={classes.colPower}>
                <PanelPowerIcon panel={panel} />
            </TableCell>
            <TableCell className={classes.colEnabled} style={{ textAlign: "center" }}>
                <ApiSwitch panelId={panel.id} checked={panel.enabled} disabled />
            </TableCell>
            <TableCell>
                <div className={classes.drag_text}>{panel.title}</div>
                <PanelRowState panel={panel} />
            </TableCell>
            <TableCell className={classes.drag_text}>{panel.description}</TableCell>
            <TableCell className={classes.drag_text}>{panel._module.longname}</TableCell>
            <TableCell className={classes.cellMenu}>
                <MoreVertIcon className={classes.colDrag} />
            </TableCell>
        </TableRow>
    );
}
