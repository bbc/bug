import React from "react";
import { makeStyles } from "@mui/styles";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const useStyles = makeStyles(async (theme) => ({
    dragIcon: {
        opacity: 0.6,
        color: theme.palette.primary.main,
        marginTop: 4,
    },
}));

export default function BugDragIcon(props) {
    const classes = useStyles();

    return <DragIndicatorIcon {...props} className={classes.dragIcon} />;
}
