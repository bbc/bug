import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

const state = {
    textTransform: "uppercase",
    opacity: 0.8,
    fontSize: "0.8rem",
    paddingTop: "4px",
    fontWeight: 500,
};

const useStyles = makeStyles((theme) => ({
    row: {
        display: "flex",
        backgroundColor: theme.palette.control.default,
        height: 65,
        alignItems: "center",
        marginBottom: 1,
        cursor: "move",
        cursor: "grab",
        userSelect: "none",
        "&:hover": {
            backgroundColor: theme.palette.control.hover,
        },
    },
    colDragIcon: {
        width: "3rem",
        textAlign: "center",
    },
    dragIcon: {
        opacity: 0.6,
        color: theme.palette.primary.main,
        marginTop: 4,
    },
    colTitle: {
        flexGrow: 3,
        fontWeight: 400,
    },
    colDescription: {
        flexGrow: 2,
        "@media (max-width:1024px)": {
            display: "none",
        },
    },
    colModule: {
        flexGrow: 2,
        "@media (max-width:512px)": {
            display: "none",
        },
    },
}));

export default function PanelTableRow({ panel, panelId }) {
    const classes = useStyles();
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: panelId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    console.log(transform);
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={classes.row}
        >
            <div className={clsx(classes.cell, classes.colDragIcon)}>
                <DragIndicatorIcon
                    {...listeners}
                    className={classes.dragIcon}
                />
            </div>
            <div className={clsx(classes.cell, classes.colTitle)}>
                {panel.title}
            </div>
            <div className={clsx(classes.cell, classes.colDescription)}>
                {panel.description}
            </div>
            <div className={clsx(classes.cell, classes.colModule)}>
                {panel._module.longname}
            </div>
        </div>
    );

    // const renderState = (panel) => {
    //     if (panel._isPending) {
    //         return <div className={classes.stateEmpty}>...</div>;
    //     }

    //     switch (panel._dockerContainer._status) {
    //         case "building":
    //             return (
    //                 <div className={classes.state_building}>
    //                     {panel._buildStatus.text} - <ProgressCounter value={panel._buildStatus.progress} />% complete
    //                 </div>
    //             );
    //         case "error":
    //             return <div className={classes.state_error}>ERROR - {panel._buildStatus.text}</div>;
    //         default:
    //             return (
    //                 <div className={`${classes["state_" + panel._dockerContainer._status]}`}>
    //                     {panel._dockerContainer._status}
    //                 </div>
    //             );
    //     }
    // };

    // return (
    //     <TableRow className={classes.row} key={props.id} ref={setNodeRef} style={style} {...attributes} {...listeners}>
    //         <TableCell>
    //             <DragIndicatorIcon />
    //         </TableCell>
    //         <TableCell>
    //             <div
    //                 className={clsx(classes.title, {
    //                     [classes.disabledText]: !props.enabled || props._isPending,
    //                 })}
    //             >
    //                 {props.title}
    //             </div>
    //             {renderState(props)}
    //         </TableCell>
    //         <TableCell
    //             className={clsx(classes.colDescription, {
    //                 [classes.disabledText]: !props.enabled || props._isPending,
    //             })}
    //         >
    //             {props.description}
    //         </TableCell>
    //         <TableCell
    //             className={clsx(classes.colModule, {
    //                 [classes.disabledText]: !props.enabled || props._isPending,
    //             })}
    //         >
    //             {props._module.longname}
    //         </TableCell>
    //     </TableRow>
    // );
}
