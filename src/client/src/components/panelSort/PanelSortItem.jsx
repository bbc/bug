import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

const useStyles = makeStyles((theme) => ({
    row: {
        display: "flex",
        touchAction: "none",
        backgroundColor: theme.palette.control.default,
        height: 65,
        alignItems: "center",
        marginBottom: 1,
        marginLeft: "2.5rem",
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
        textAlign: "left",
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

export default function PanelSortItem({ panel, id }) {
    const classes = useStyles();
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: id });

    let transformString = null;

    if (transform?.y) {
        transformString = `translateY(${Math.round(transform?.y)}px)`;
    }

    const style = {
        transform: transformString,
        transition,
    };

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
}
