import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PanelSortItem from "@components/panels/PanelSortItem";
import clsx from "clsx";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const useStyles = makeStyles((theme) => ({
    row: {
        display: "flex",
        touchAction: "none",
        backgroundColor: theme.palette.control.default,
        height: 48,
        alignItems: "center",
        marginBottom: 1,
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
        fontSize: "0.875rem",
        fontWeight: 500,
        textTransform: "uppercase",
        color: theme.palette.primary.main,
    },
}));

export default function PanelSortGroup(props) {
    const classes = useStyles();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.group });

    let transformString = null;

    if (transform?.y) {
        transformString = `translateY(${Math.round(transform?.y)}px)`;
    }

    const style = {
        transform: transformString,
        transition,
    };

    const makeGroups = (
        <div className={classes.row}>
            <div className={clsx(classes.cell, classes.colDragIcon)}>
                <DragIndicatorIcon {...listeners} className={classes.dragIcon} />
            </div>
            <div className={clsx(classes.cell, classes.colTitle)}>{props.group}</div>
        </div>
    );

    if (props.panels) {
        return (
            <>
                <div className={classes.table} ref={setNodeRef} style={style} {...attributes}>
                    {makeGroups}
                    <SortableContext
                        items={props.panels.map((panel) => `${props.group}:${panel.id}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        {props.panels.map((panel) => (
                            <PanelSortItem key={panel.id} id={`${props.group}:${panel.id}`} panel={panel} />
                        ))}
                    </SortableContext>
                </div>
            </>
        );
    } else {
        return null;
    }
}