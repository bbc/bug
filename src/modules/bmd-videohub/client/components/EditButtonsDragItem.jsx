import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { useSortable } from "@dnd-kit/sortable";

const useStyles = makeStyles((theme) => ({
    listItem: {
        borderBottom: "1px solid #282828",
        height: 51,
        cursor: "move",
        paddingLeft: 8,
        paddingRight: 8,
    },
    dragIcon: {
        opacity: 0.6,
        color: theme.palette.primary.main,
        minWidth: 32,
        padding: 4,
    },
    removeButton: {
        opacity: 0.7,
    },
    indexText: {
        paddingRight: 8,
        fontWeight: 900,
        opacity: 0.3,
    },
}));

export default function EditButtonsDragItem({ button, onRemove }) {
    const classes = useStyles();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `button:${button.index}` });

    let transformString = null;

    // console.log(transform);
    if (transform?.y) {
        transformString = `translateY(${Math.round(transform?.y)}px)`;
    }

    const style = {
        transform: transformString,
        transition,
    };

    return (
        <ListItem
            className={classes.listItem}
            key={button.index}
            role="listitem"
            button
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <ListItemIcon className={classes.dragIcon}>
                <DragIndicatorIcon fontSize="small" />
            </ListItemIcon>
            <div className={classes.indexText}>{button.index + 1}</div>
            <ListItemText primary={button.label} />
            <IconButton onClick={() => onRemove(button.index)} className={classes.removeButton}>
                <CloseIcon />
            </IconButton>
        </ListItem>
    );
}
