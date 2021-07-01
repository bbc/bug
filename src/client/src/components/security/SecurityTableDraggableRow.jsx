import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableRowDragIcon from "@core/TableRowDragIcon";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const useStyles = makeStyles((theme) => ({
    tableRow: {
        cursor: "grab",
        height: 55,
    },
    colDrag: {
        width: 82,
    },
    colType: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colDescription: {
        "@media (max-width:1024px)": {
            display: "none",
        },
    },
    colNav: {
        width: "1rem",
    },
}));

export default function SecurityTableRow({ strategy, index }) {
    const classes = useStyles();
    console.log(strategy.type);
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
            className={classes.tableRow}
            index={index}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <TableCell className={classes.colDrag}>
                <TableRowDragIcon />
            </TableCell>
            <TableCell className={classes.colName}>{strategy.name}</TableCell>
            <TableCell className={classes.colType}>{strategy.type.toUpperCase()}</TableCell>
            <TableCell className={classes.colDescription}>{strategy.description}</TableCell>
            <TableCell className={classes.colNav}></TableCell>
        </TableRow>
    );
}
