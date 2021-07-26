import React from "react";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { makeStyles } from "@material-ui/core/styles";
import ApiSwitch from "@core/ApiSwitch";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ProgressCounter from "@components/ProgressCounter";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";
import PowerIcon from "@core/PowerIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const useStyles = makeStyles((theme) => ({
    cellMenu: {
        width: "2rem",
    },
    drag_text: {
        color: theme.palette.secondary.main,
        opacity: 0.3,
        paddingTop: "4px",
    },
    drag_text_subtitle: {
        color: theme.palette.secondary.main,
        textTransform: "uppercase",
        fontSize: "0.8rem",
        paddingTop: "4px",
        fontWeight: 500,
        opacity: 0.1,
    },
    disabledText: {
        opacity: 0.3,
    },
    colDrag: {
        color: theme.palette.secondary.main,
        opacity: 0.3,
        width: 56,
        textAlign: "center",
    },
    colPower: {
        width: 56,
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
    panelRowCursor: {
        cursor: "pointer",
    },
}));

export default function PanelTableRow({ id, showGroups, panel }) {
    const classes = useStyles();
    const errorCount = panel._status.filter((x) => x.type === "error").length;
    const warningCount = panel._status.filter((x) => x.type === "warning").length;
    const criticalCount = panel._status.filter((x) => x.type === "critical").length;

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const renderState = (panel) => {
        if (panel._isPending) {
            return <div className={classes.drag_text_subtitle}>...</div>;
        }

        switch (panel._dockerContainer._status) {
            case "building":
                return (
                    <div className={classes.drag_text_subtitle}>
                        {panel._buildStatus.text} - <ProgressCounter value={panel._buildStatus.progress} />% complete
                    </div>
                );
            case "error":
                return <div className={classes.drag_text_subtitle}>ERROR - {panel._buildStatus.text}</div>;
            default:
            // do nothing
        }

        // if the container isn't running, we don't care about statusItems
        if (panel._dockerContainer._status !== "running") {
            return <div className={classes.drag_text_subtitle}>{panel._dockerContainer._status}</div>;
        }

        if (criticalCount > 0) {
            return <div className={classes.drag_text_subtitle}>RUNNING - WITH {criticalCount} CRITICAL ERROR(S)</div>;
        } else if (errorCount > 0) {
            return <div className={classes.drag_text_subtitle}>RUNNING - WITH {errorCount} ERROR(S)</div>;
        } else if (errorCount > 0) {
            return <div className={classes.drag_text_subtitle}>RUNNING - WITH {warningCount} WARNINGS(S)</div>;
        }

        // this'll only be 'running' but I just left the whole thing in here ...
        return <div className={classes.drag_text_subtitle}>{panel._dockerContainer._status}</div>;
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            key={`${panel.group}:${panel.id}`}
            hover={panel.enabled}
            className={clsx({
                [classes.panelRowCursor]: panel.enabled,
            })}
        >
            {panel.showGroups ? <TableCell className={classes.colIndent} /> : null}
            <TableCell className={classes.colDrag}>
                <DragIndicatorIcon />
            </TableCell>

            <TableCell className={classes.colPower}>
                <PowerIcon />
            </TableCell>
            <TableCell className={classes.colEnabled} style={{ textAlign: "center" }}>
                <ApiSwitch panelId={panel.id} checked={panel.enabled} disabled />
            </TableCell>
            <TableCell>
                <div className={classes.drag_text}>{panel.title}</div>
                {renderState(panel)}
            </TableCell>
            <TableCell className={classes.drag_text}>{panel.description}</TableCell>
            <TableCell className={classes.drag_text}>{panel._module.longname}</TableCell>
            <TableCell className={classes.cellMenu}>
                <MoreVertIcon className={classes.colDrag} />
            </TableCell>
        </TableRow>
    );
}
