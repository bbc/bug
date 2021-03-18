import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    title: {
        backgroundColor: theme.palette.menu.main,
        width: "100%",
        color: "#ffffff",
        fontSize: "2.5rem",
        padding: "0.5rem 1rem",
    },
}));

export default function PanelTitle() {
    const classes = useStyles();

    return <div className={classes.title}>{props.title}</div>;
}
