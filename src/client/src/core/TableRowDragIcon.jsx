import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

const useStyles = makeStyles((theme) => ({
    dragIcon: {
        opacity: 0.6,
        color: theme.palette.primary.main,
        marginTop: 4,
    },
}));

export default function TableRowDragIcon(props) {
    const classes = useStyles();

    return <DragIndicatorIcon {...props} className={classes.dragIcon} />;
}
