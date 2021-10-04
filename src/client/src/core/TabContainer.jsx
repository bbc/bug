import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    tabContainer: {
        width: "100%",
        position: "absolute",
        backgroundColor: theme.palette.appbar.default,
    },
    tabSpacer: {
        height: 57,
        position: "relative",
        zIndex: -1,
    },
}));

export default function TabContainer(props) {
    const classes = useStyles();

    return (
        <>
            <div className={classes.tabContainer}>{props.children}</div>
            <div className={`tabSpacer ${classes.tabSpacer}`}></div>
        </>
    );
}
